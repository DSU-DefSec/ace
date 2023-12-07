@echo off

echo ---------- SMB ----------

:: Disable SMB1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB1 /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB1 /t REG_DWORD /d 0 /f

:: Minimum SMB version
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB2 /t REG_DWORD /d 2 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB2 /t REG_DWORD /d 2 /f

:: Security Signature
reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f
reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f

:: Hardening
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareServer /t REG_DWORD /d 0 /f
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareWks /t REG_DWORD /d 0 /f
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RejectUnencryptedAccess /t REG_DWORD /d 1 /f
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AnnounceServer /t REG_DWORD /d 0 /f

:: Remove default shares
net share C$ /delete
net share ADMIN$ /delete

echo %ComputerName% SMB secured.

pause
exit /b 0
