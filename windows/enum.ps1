# Malachi Reynolds - 01/26/25 - Dakota State University

$ServiceInfo = @(
    # Web Servers
    @{ Name = "IIS Web"; Path = "C:\inetpub\wwwroot"; Port = 80 },
    @{ Name = "Apache Web"; Path = "C:\Program Files\Apache Group\Apache2"; Port = 80 },
    @{ Name = "Nginx Web"; Path = "C:\nginx"; Port = 80 },
    @{ Name = "HTTPS"; Path = "C:\inetpub\wwwroot"; Port = 443 }
    @{ Name = "XAMPP"; Path = "C:\xampp"; Port = 80 }

    # File Sharing Services
    @{ Name = "FTP Server"; Path = "C:\inetpub\ftproot"; Port = 21 },
    @{ Name = "FileZilla"; Path = "C:\Program Files\FileZilla Server\FileZilla server.exe"; Port = 21 },
    @{ Name = "SMB"; Path = "C:\Windows\System32\drivers\srv.sys"; Port = 445 },

    # Remote Access Services
    @{ Name = "RDP"; Path = "C:\Windows\System32\mstsc.exe"; Port = 3389 },
    @{ Name = "Telnet"; Path = "C:\Windows\System32\tlntsvr.exe"; Port = 23 },
    @{ Name = "OpenSSH"; Path = "C:\Program Files\OpenSSH"; Port = 22 }

    # # Database Servers
    @{ Name = "MySQL"; Path = "C:\Program Files\MySQL\MySQL Server *"; Port = 3306 },
    @{ Name = "MicrosoftSQL"; Path = "C:\Program Files\Microsoft SQL Server"; Port = 1433 },
    @{ Name = "PostgreSQL"; Path = "C:\Program Files\PostgreSQL"; Port = 5432 },
    @{ Name = "MongoDB"; Path = "C:\Program Files\MongoDB\Server"; Port = 27017 },
    @{ Name = "Redis"; Path = "C:\Program Files\Redis"; Port = 6379 },

    # Mail Services
    @{ Name = "SMTP Server"; Path = "C:\Windows\System32\smtpsvc.dll"; Port = 25 },
    @{ Name = "POP3 Mail"; Path = "C:\Program Files\POP3 Service"; Port = 110 },
    @{ Name = "IMAP Mail"; Path = "C:\Program Files\IMAP Service"; Port = 143 },

    # DNS Services
    @{ Name = "DNS"; Path = "C:\Windows\System32\dns.exe"; Port = 53 },

    # Virtualization and Containerization
    @{ Name = "Docker"; Path = "C:\Program Files\Docker"; Port = 2375 },
    @{ Name = "Kubernetes"; Path = "C:\kubernetes"; Port = 10250 },

    # Other Common Services
    @{ Name = "LDAP"; Path = "C:\Windows\System32\ntds.dit"; Port = 389 },
    @{ Name = "SNMP"; Path = "C:\Windows\System32\snmp.exe"; Port = 161 },
    @{ Name = "NTP"; Path = "C:\Windows\System32\w32time.dll"; Port = 123 },
    @{ Name = "VNC Server"; Path = "C:\Program Files\RealVNC\VNC Server"; Port = 5900 },
    @{ Name = "WinRM"; Path = "C:\Windows\System32\winrm.cmd"; Port = 5985 },
    @{ Name = "Syslog"; Path = "C:\Program Files\Syslog"; Port = 514 }
)

$StartTime = Get-Date

if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {
    Write-Host "`nError: This script must be run as Administrator for full enumeration." -ForegroundColor Red
}

Write-Output "`n===================================="
Write-Output "==> Operating System Information <=="
Write-Output "===================================="

$OSInfo = Get-CimInstance -ClassName Win32_OperatingSystem


try {
    $Domain = (Get-ADDomain -ErrorAction Stop).DNSRoot
    if (Get-CimInstance -Class Win32_OperatingSystem -Filter 'ProductType = "2"') {
        $DC = $true
    }
} catch {
    $Domain = "N/A"
    $DC = $false
}

[PSCustomObject]@{
    "Name"         = $OSInfo.CSName
    "OS"           = ($OSInfo.Caption -replace "Microsoft ", "")
    "Domain"       = $Domain
    "DC"           = $DC
    "Version"      = $OSInfo.Version
    "Build Number" = $OSInfo.BuildNumber
} | Format-Table -AutoSize

Write-Output "`n===================================="
Write-Output "======> Host Firewall Status <======"
Write-Output "====================================`n"

$lines = (netsh advfirewall show allprofiles state) -split "`r`n"

$profiles = @("Domain Profile", "Private Profile", "Public Profile")

foreach ($profile in $profiles) {
    $profileLine = $lines | Where-Object { $_ -match "$profile Settings:" }
    
    if ($profileLine) {
        $profileIndex = $lines.IndexOf($profileLine)
        
        for ($i = 1; $i -le 3; $i++) {
            if ($profileIndex + $i -lt $lines.Count) {
                $stateLine = $lines[$profileIndex + $i]
                if ($stateLine -match "State\s+(\w+)") {
                    $state = $matches[1]
                    if ($state -eq "ON") {
                        Write-Host "$profile`: $state" -ForegroundColor Green
                    } elseif ($state -eq "OFF") {
                        Write-Host "$profile`: $state" -ForegroundColor Red
                    } else {
                        Write-Host "$profile`: Unknown ($state)" -ForegroundColor Yellow
                    }
                    break
                }
            }
        }
    } else {
        Write-Host "$profile`: N\A" -ForegroundColor Yellow
    }
}

Write-Output "`n===================================="
Write-Output "===> Defender Antivirus Status <===="
Write-Output "====================================`n"

try {
    $defenderExceptions = @{
        Processes = (Get-MpPreference | Select-Object -ExpandProperty ExclusionProcess)
        Paths = (Get-MpPreference | Select-Object -ExpandProperty ExclusionPath)
        Extensions = (Get-MpPreference | Select-Object -ExpandProperty ExclusionExtension)
        IPAddresses = (Get-MpPreference | Select-Object -ExpandProperty ExclusionIpAddress)
    }

    $defenderStatus = Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, IoavProtectionEnabled, AntispywareEnabled

    Write-Host "Windows Defender Status:" -ForegroundColor Cyan
    $defenderStatus.PSObject.Properties | ForEach-Object {
        $color = if ($_.Value -eq $true) { "Green" } else { "Red" }
        Write-Host "$($_.Name): $($_.Value)" -ForegroundColor $color
    }

    Write-Host "`nWindows Defender Exceptions:" -ForegroundColor Cyan
    $defenderExceptions.GetEnumerator() | ForEach-Object {
        Write-Host "`n$($_.Key) Exceptions:" -ForegroundColor Yellow
        if ($_.Value) {
            $_.Value | ForEach-Object { 
                Write-Host "- $_" -ForegroundColor White
            }
        } else {
            Write-Host "No exceptions found." -ForegroundColor Gray
        }
    }

} catch {
    Write-Host "Defender returned an error. Likely not working." -ForegroundColor Red
}



Write-Output "`n===================================="
Write-Output "=====> Network Configuration <======"
Write-Output "===================================="

$NetworkAdapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
$NetworkAdapters | Select-Object Name, (@{Name = "IP"; Expression = {
    (Get-NetIPAddress -InterfaceAlias $_.Name -AddressFamily IPv4).IPAddress
}}), MacAddress | Format-Table -AutoSize



Write-Output "`n===================================="
Write-Output "==========> Local Shares <=========="
Write-Output "===================================="
$shares = Get-WmiObject -Class Win32_Share -ComputerName $env:COMPUTERNAME |
    Where-Object { $_.Name -notlike "*$" }

if ($shares) {
    $shares | Format-Table Name, Path -AutoSize
} else {
    Write-Host "`nNo local shares found." -ForegroundColor Yellow
}


Write-Output "`n===================================="
Write-Output "=======> Installed Software <======="
Write-Output "===================================="

$InstalledPrograms = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* ,
    HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\* |
    Select-Object DisplayName, DisplayVersion | Where-Object { $_.DisplayName -and $_.DisplayName.Trim() -ne "" -and
    $_.DisplayName -notmatch "Microsoft \.NET|Microsoft Visual C\+\+|Microsoft Windows Desktop Runtime"}

$InstalledPrograms | Sort-Object DisplayName | Format-Table -AutoSize


$ActivePorts = Get-NetTCPConnection | Where-Object { $_.State -eq 'Listen' -or  $_.State -eq 'Established' } | Select-Object LocalPort

$Results = @()

foreach ($Service in $ServiceInfo) {
    $PathExists = Test-Path -Path $Service.Path
    $IsPortActive = $ActivePorts.LocalPort -contains $Service.Port

    $Results += [PSCustomObject]@{
        "Name"     = $Service.Name
        "Exists"   = $PathExists
        "Listening"= $IsPortActive
        "Port"     = $Service.Port
        "Filepath" = $Service.Path
        "Status"   = if ($PathExists -and $IsPortActive) {
                        "Running"
                    } elseif ($PathExists){
                        "Not Running"
                    } elseif  ($IsPortActive) {
                        "Not Installed"
                    } else{
                        "Not Found"
                    }
    }
}
Write-Output "`n===================================="
Write-Output "========> Service Status <=========="
Write-Output "===================================="
$Results | Where-Object { $_.Exists -or $_.Up } | Select-Object Name, Exists, Listening, Port, Filepath, Status | Format-Table -AutoSize
Write-Host "`nEnumeration Complete!" -ForegroundColor Green
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]"Administrator")) {
    Write-Host "Error: This script must be run as Administrator for full enumeration." -ForegroundColor Red
}

$EndTime = Get-Date
Write-Output "`nScript Execution Time: $(($EndTime - $StartTime).TotalSeconds) seconds`n`n"