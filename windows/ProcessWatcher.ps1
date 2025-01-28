# Requires Administrator privileges
#Requires -RunAsAdministrator

# Initialize process tracking
$script:allowedProcesses = @{}
Get-Process | ForEach-Object { $script:allowedProcesses[$_.Name] = $true }

# Configure popup parameters
$popupTimeout = 5  # Seconds before auto-terminate
$buttonYes = 6     # WScript return code for Yes
$buttonNo = 7      # WScript return code for No

# Event action handler
$action = {
    $processName = $event.SourceEventArgs.NewEvent.ProcessName
    $processId = $event.SourceEventArgs.NewEvent.ProcessId

    if (-not $allowedProcesses.ContainsKey($processName)) {
        # Create interactive popup
        $popupMessage = @"
ALARM! NEW PROCESS HAS STARTED!
Name: $processName
PID: $processId

Allow this process?
"@
        $wshell = New-Object -ComObject WScript.Shell
        $response = $wshell.Popup(
            $popupMessage,
            $popupTimeout,
            "Security Control - $processName",
            0x34 -bor 0x1000 # 0x4 (Yes/No) + 0x30 (Question icon)
        )

        switch ($response) {
            $buttonYes {
                $script:allowedProcesses[$processName] = $true
                Write-Host "[ALLOWED] $processName (PID: $processId)"
            }
            default {
                Write-Host "[TERMINATING] $processName (PID: $processId)"
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# Register WMI event watcher
$query = "SELECT * FROM Win32_ProcessStartTrace"
$eventParams = @{
    Query          = $query
    Action         = $action
    SourceIdentifier = "ProcessMonitor"
    ErrorAction    = "Stop"
}
Register-CimIndicationEvent @eventParams | Out-Null

# Keep console active
Write-Host "Process Monitor Active (Ctrl+C to exit)..."
Write-Host "Allowed processes: $($script:allowedProcesses.Count)"
try {
    while ($true) { Start-Sleep -Seconds 1 }
}
finally {
    # Cleanup event registration
    Unregister-Event -SourceIdentifier "ProcessMonitor"
    Get-EventSubscriber | Where-Object SourceIdentifier -eq "ProcessMonitor" | Unregister-Event
}