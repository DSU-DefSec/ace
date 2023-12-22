@echo off
setlocal enabledelayedexpansion

echo ---------- SMB ----------

:: Clean slate
set "ErrorActionPreference=Continue"

:: Function to suppress output
:quiet
>nul 2>&1 (
    set /p dummyVar=""
)

:: Get and display computer system information
for /f "tokens=*" %%A in ('wmic computersystem get Name^,Domain /value 2^>nul') do (
    set "%%A"
)
echo Name: %Name%
echo Domain: %Domain%

:: Get and display network adapter information
for /f "tokens=*" %%A in ('wmic nicconfig where "IPAddress is not null" get ServiceName^,IPAddress /value 2^>nul') do (
    set "%%A"
    echo ServiceName: !ServiceName!
    echo IPAddress: !IPAddress!
)

:: Get and display SMB-related services
for /f "tokens=*" %%A in ('sc query state^= all ^| find "SERVICE_NAME" ^| findstr /i "SMB" 2^>nul') do (
    set "%%A"
    echo DisplayName: !DisplayName!
    echo ServiceName: !SERVICE_NAME!
    echo Status: !STATE!
)

echo %COMPUTERNAME% SMB secured.
echo.

:: Disable SMB1
call :quiet reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB1 /t REG_DWORD /d 0 /f
call :quiet reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB1 /t REG_DWORD /d 0 /f

:: Minimum SMB version
call :quiet reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v SMB2 /t REG_DWORD /d 2 /f
call :quiet reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v SMB2 /t REG_DWORD /d 2 /f

:: Security Signature
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanManWorkstation\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f

:: Hardening
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareServer /t REG_DWORD /d 0 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareWks /t REG_DWORD /d 0 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v RejectUnencryptedAccess /t REG_DWORD /d 1 /f
call :quiet reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AnnounceServer /t REG_DWORD /d 0 /f
call :quiet net share C$ /delete
call :quiet net share ADMIN$ /delete

echo %COMPUTERNAME% SMB secured.
echo.
endlocal
exit /b
