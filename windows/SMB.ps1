Write-Host "---------- SMB ----------" -ForegroundColor Green

# Clean slate
$Error.Clear()
$ErrorActionPreference = "Continue"

$POSHversion = $PSVersionTable.PSVersion.Major -ge 3

# Get and display computer system information
Get-WmiObject -Namespace root\cimv2 -Class Win32_ComputerSystem |
    Select-Object Name, Domain |
    Format-Table -AutoSize:$POSHversion

# Get and display network adapter information
Get-WmiObject Win32_NetworkAdapterConfiguration |
    Where-Object { $_.IPAddress -ne $null } |
    ForEach-Object {
        [PSCustomObject]@{
            ServiceName = $_.ServiceName
            IPAddress = $_.IPAddress -join ', '
        }
    } | Format-Table -AutoSize:$POSHversion


    Get-Service |
    Where-Object { $_.DisplayName -like "*SMB*" -or $_.ServiceName -like "*SMB*" } |
    Select-Object DisplayName, ServiceName, Status |
    Format-Table -AutoSize:$POSHversion


# Disable SMB1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB1 /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB1 /t REG_DWORD /d 0 /f | Out-Null

# Minimum SMB version
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB2 /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB2 /t REG_DWORD /d 2 /f | Out-Null

# Security Signature
reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f | Out-Null

# Hardening
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareServer /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareWks /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RejectUnencryptedAccess /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AnnounceServer /t REG_DWORD /d 0 /f | Out-Null
net share C$ /delete | Out-Null
net share ADMIN$ /delete | Out-Null



Write-Host "$Env:ComputerName SMB secured." -ForegroundColor Green
