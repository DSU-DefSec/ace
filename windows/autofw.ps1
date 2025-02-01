param (
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true, HelpMessage = "Provide the allowed TCP ports as space-separated values.")]
    [int[]]$AllowedTCPPorts
)

$RulePrefix = "Firewall-"

# Ask user for UDP ports before execution
$UserUDPInput = Read-Host "Enter UDP ports to allow (comma-separated, or leave blank for none)"
$AllowedUDPPorts = @()
if ($UserUDPInput -match "\d") {
    $AllowedUDPPorts = $UserUDPInput -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -match "^\d+$" } | ForEach-Object { [int]$_ }
}

# Ask user if they want to auto-kill WinRM sessions
$AutoKillWinRM = $false
$UserResponse = Read-Host "Do you want to auto-kill WinRM sessions? (yes/no)"
if ($UserResponse -match "^(y|yes)$") {
    $AutoKillWinRM = $true
}

function Enforce-FirewallRules {
    Write-Host "n[INFO] Enforcing Firewall Rules..." -ForegroundColor Cyan

    $ExistingRules = Get-NetFirewallRule -Direction Inbound | Where-Object { $_.Enabled -eq $true }

    foreach ($Rule in $ExistingRules) {
        $PortFilter = Get-NetFirewallPortFilter -AssociatedNetFirewallRule $Rule
        $RulePort = $PortFilter.LocalPort

        if ($RulePort -eq "Any" -or -not ($RulePort -as [int])) {
            Write-Host "[DISABLING] Rule: $($Rule.DisplayName) (Non-numeric port or 'Any')" -ForegroundColor Red
            Set-NetFirewallRule -Name $Rule.Name -Enabled False
            continue
        }

        if (($AllowedTCPPorts + $AllowedUDPPorts) -notcontains [int]$RulePort) {
            Write-Host "[DISABLING] Rule: $($Rule.DisplayName) on port $RulePort" -ForegroundColor Red
            Set-NetFirewallRule -Name $Rule.Name -Enabled False
        }
    }

    foreach ($Port in $AllowedTCPPorts) {
        $RuleName = "$RulePrefix-TCP-$Port"

        if (-not (Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue)) {
            Write-Host "[ADDING] TCP Rule for port $Port" -ForegroundColor Green
            New-NetFirewallRule -DisplayName $RuleName 
                -Direction Inbound 
                -Protocol TCP 
                -LocalPort $Port 
                -Action Allow 
                -Enabled True
        } else {
            Write-Host "[ALREADY EXISTS] TCP Rule for port $Port" -ForegroundColor Yellow
            Set-NetFirewallRule -DisplayName $RuleName -Enabled True
        }
    }

    foreach ($Port in $AllowedUDPPorts) {
        $RuleName = "$RulePrefix-UDP-$Port"

        if (-not (Get-NetFirewallRule -DisplayName $RuleName -ErrorAction SilentlyContinue)) {
            Write-Host "[ADDING] UDP Rule for port $Port" -ForegroundColor Green
            New-NetFirewallRule -DisplayName $RuleName 
                -Direction Inbound 
                -Protocol UDP 
                -LocalPort $Port 
                -Action Allow 
                -Enabled True
        } else {
            Write-Host "[ALREADY EXISTS] UDP Rule for port $Port" -ForegroundColor Yellow
            Set-NetFirewallRule -DisplayName $RuleName -Enabled True
        }
    }
}

function Show-Popup {
    param (
        [string]$Message,
        [string]$Title = "Notification",
        [int]$ProcessId
    )
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($Message, $Title, [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Information)
}

function Get-RemoteIPAddress {
    param (
        [int]$ProcessId
    )
    try {
        $connections = Get-NetTCPConnection | Where-Object { $_.OwningProcess -eq $ProcessId -and $_.State -eq "Established" }
        if ($connections) {
            return $connections.RemoteAddress
        }
        return "Unknown"
    } catch {
        return "Unknown"
    }
}

function Monitor-ShellConnections {
    try {
        # Detect remote WinRM PowerShell sessions (excluding WinRM service)
        $WinRMSessions = Get-WmiObject -Namespace root\cimv2 -Class Win32_Process | Where-Object {
            ($_.Name -match "wsmprovhost.exe" -or ($_.Name -match "powershell.exe" -and $_.CommandLine -match "-s") ) -and $_.ProcessId
        }

        foreach ($session in $WinRMSessions) {
            $ProcessId = $session.ProcessId
            $RemoteIP = Get-RemoteIPAddress -ProcessId $ProcessId

            if ($AutoKillWinRM) {
                # Auto-kill and notify user
                Write-Host "[AUTO-KILL] WinRM Session (PID $ProcessId) from IP $RemoteIP" -ForegroundColor Red
                Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
                Show-Popup -Message "Auto-Killed a remote PowerShell session via WinRM (PID $ProcessId) from IP $RemoteIP." -Title "WinRM Session Terminated"
            } else {
                # Ask user before terminating
                Add-Type -AssemblyName PresentationFramework
                $result = [System.Windows.MessageBox]::Show("A remote PowerShell session via WinRM (PID $ProcessId) from IP $RemoteIP was detected. Do you want to terminate it?", "WinRM Session Alert", [System.Windows.MessageBoxButton]::YesNo, [System.Windows.MessageBoxImage]::Warning)
                
                if ($result -eq [System.Windows.MessageBoxResult]::Yes) {
                    Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
                    Write-Host "[TERMINATED] WinRM Session (PID $ProcessId) from IP $RemoteIP" -ForegroundColor Red
                }
            }
        }

        # Detect SSH sessions
        $sshProcesses = Get-Process | Where-Object { $_.Name -like "ssh" }

        foreach ($process in $sshProcesses) {
            $RemoteIP = Get-RemoteIPAddress -ProcessId $process.Id
            Show-Popup -Message "An SSH connection (PID $($process.Id)) from IP $RemoteIP was detected. Do you want to terminate it?" -Title "SSH Connection Alert" -ProcessId $process.Id
        }
    } catch {
        Write-Host "[ERROR] Error in monitoring: $_" -ForegroundColor Red
    }
}

# Enforce firewall rules and monitor connections in a continuous loop
while ($true) {
    try {
        Write-Host "n[INFO] Enforcing Firewall Rules and Monitoring Connections..." -ForegroundColor Cyan
        Enforce-FirewallRules
        Monitor-ShellConnections
    } catch {
        Write-Host "[ERROR] $_" -ForegroundColor Red
    }
    Start-Sleep -Seconds 2
}