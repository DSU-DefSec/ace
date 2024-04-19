$Error.Clear()
$ErrorActionPreference = "Continue"

$currentDir = (Get-Location).Path
$ConfPath = Join-Path -Path $currentDir -ChildPath "conf"

Write-Host "Securing RDP" -ForegroundColor white
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 1 /f | Out-Null
## Requiring encrypted RPC connections
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fEncryptRPCTraffic /t REG_DWORD /d 1 /f | Out-Null
## Disabling remote assistance
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fAllowToGetHelp /t REG_DWORD /d 0 /f | Out-Null
## Prevent sharing of local drives via Remote Desktop Session Hosts
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fDisableCdm /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] RDP secured" -ForegroundColor white

$RDP = Read-Host "Disable RDP?"
if ($RDP -eq "yes" -or $RDP -eq "y") {
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f
    Write-Host "[INFO] RDP disabled"
}
else {
    Write-Host "RDP will stay enabled." -ForegroundColor white
}

    # Securing WinRM
    ## Disallowing unencrypted traffic
    net stop WinRM
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WinRM\Service" /v AllowUnencryptedTraffic /t REG_DWORD /d 0 /f | Out-Null
    net start WinRM
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] WinRM secured and restarted" -ForegroundColor white

    $WinRM = Read-Host "Disable WinRM?"

if ($WinRM -eq "yes" -or $WinRM -eq "y") {

    # Disabling WinRM
    Disable-PSRemoting -Force
    Remove-Item -Path WSMan:\Localhost\listener\listener* -Recurse
    Stop-Service WinRM -PassThru
    Set-Service WinRM -StartupType Disabled -PassThru
    Write-Host "[INFO] WinRM disabled and listeners removed"
}
else {
    Write-Host "The computer will not disable WinRM."
}

# Disabling unneeded Windows features
$features = @("MicrosoftWindowsPowerShellV2", "MicrosoftWindowsPowerShellV2Root", "SMB1Protocol")
foreach ($feature in $features) {
    if ((Get-WindowsOptionalFeature -Online -FeatureName $feature | Select-Object "State") -eq "Enabled") {
        Disable-WindowsOptionalFeature -Online -FeatureName $feature -norestart
        Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Uninstalled $feature" -ForegroundColor white
    }
}

$gp = (Join-Path -Path $currentDir -ChildPath "results\gp")
if(!(Test-Path -Path $gp)) {
    New-Item -Path (Join-Path -Path $currentDir -ChildPath "results\gp") -ItemType Directory
}
Copy-Item C:\Windows\System32\GroupPolicy* $gp -Recurse | Out-Null
Remove-Item C:\Windows\System32\GroupPolicy* -Recurse -Force | Out-Null
gpupdate /force
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Local group policy reset" -ForegroundColor white


#CVEs
## Mitigating CVE-2021-1675 and CVE 2021-34527 (PrintNightmare)
reg add "HKLM\Software\Policies\Microsoft\Windows NT\Printers" /v CopyFilesPolicy /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\Software\Policies\Microsoft\Windows NT\Printers" /v RegisterSpoolerRemoteRpcEndPoint /t REG_DWORD /d 2 /f | Out-Null
reg delete "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Printers\PointAndPrint" /f | Out-Null
## Mitigating CVE-2021-1678
reg add "HKLM\System\CurrentControlSet\Control\Print" /v RpcAuthnLevelPrivacyEnabled /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] PrintNightmare mitigations in place" -ForegroundColor white
# Credential Delegation settings
## Enabling support for Restricted Admin/Remote Credential Guard
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\CredentialsDelegation" /v AllowProtectedCreds /t REG_DWORD /d 1 /f | Out-Null
## Enabling Restricted Admin mode
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v DisableRestrictedAdmin /t REG_DWORD /d 0 /f | Out-Null
## Disabling Restricted Admin Outbound Creds
reg add "HKLM\System\CurrentControlSet\Control\Lsa" /v DisableRestrictedAdminOutboundCreds /t REG_DWORD /d 1 /f | Out-Null
## Enabling Credential Delegation (Restrict Credential Delegation)
reg add "HKLM\Software\Policies\Microsoft\Windows\CredentialsDelegation" /v RestrictedRemoteAdministration /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\Software\Policies\Microsoft\Windows\CredentialsDelegation" /v RestrictedRemoteAdministrationType /t REG_DWORD /d 3 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Credential Delegation settings set" -ForegroundColor white

# User Account Control (UAC)
## Enabling Restricted Admin mode
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v FilterAdministratorToken /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableUIADesktopToggle /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v ConsentPromptBehaviorAdmin /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v ConsentPromptBehaviorUser /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableInstallerDetection /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v ValidateAdminCodeSignatures /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableSecureUIAPaths /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableLUA /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v PromptOnSecureDesktop /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v EnableVirtualization /t REG_DWORD /d 1 /f | Out-Null
## Applying UAC restrictions to local accounts on network logons
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System" /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] UAC set up" -ForegroundColor white


# LSASS Protections
## Enabling LSA protection mode
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RunAsPPL /t REG_DWORD /d 1 /f | Out-Null
## Enabling LSASS audit mode
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\LSASS.exe" /v AuditLevel /t REG_DWORD /d 8 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v LimitBlankPasswordUse /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v restrictanonymous /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v restrictanonymoussam /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v NoLMHash /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v SubmitControl /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v disabledomaincreds /t REG_DWORD /d 1 /f | Out-Null
## Restricting access from anonymous users (treating them seperate from Everyone group)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v everyoneincludesanonymous /t REG_DWORD /d 0 /f | Out-Null
## Setting amount of time to clear logged-off users' credentials from memory (secs)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v TokenLeakDetectDelaySecs /t REG_DWORD /d 30 /f | Out-Null
## Restricting remote calls to SAM to just Administrators
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v RestrictRemoteSAM /t REG_SZ /d "O:BAG:BAD:(A;;RC;;;BA)" /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] LSASS Protections in place" -ForegroundColor white

# Disabling WDigest, removing storing plain text passwords in LSASS
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest" /v UseLogonCredential /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\WDigest" /v Negotiate /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] WDigest disabled" -ForegroundColor white

# Disabling autologon
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" /v AutoAdminLogon /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Autologon disabled" -ForegroundColor white

## Setting screen saver grace period
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon" /v ScreenSaverGracePeriod /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Screen saver grace period set to 0 seconds" -ForegroundColor white

# Caching logons
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v CachedLogonsCount /t REG_SZ /d 0 /f | Out-Null
# Clear cached credentials [TEST]
# cmdkey /list | ForEach-Object{if($_ -like "*Target:*" -and $_ -like "*microsoft*"){cmdkey /del:($_ -replace " ","" -replace "Target:","")}}
# Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Cached credentials cleared, set to store none" -ForegroundColor white

# NTLM Settings
## Could impact share access (configured to only send NTLMv2, refuse LM & NTLM) - CVE-2019-1040
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v LMCompatibilityLevel /t REG_DWORD /d 5 /f | Out-Null
## Allowing Local System to use computer identity for NTLM
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v UseMachineId /t REG_DWORD /d 1 /f | Out-Null
## Preventing null session fallback for NTLM
reg add "HKLM\SYSTEM\CurrentControlSet\Control\LSA\MSV1_0" /v allownullsessionfallback /t REG_DWORD /d 0 /f | Out-Null
## Setting NTLM SSP server and client to require NTLMv2 and 128-bit encryption
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0" /v NTLMMinServerSec /t REG_DWORD /d 537395200 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0" /v NTLMMinClientSec /t REG_DWORD /d 537395200 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured NTLM settings" -ForegroundColor white

# System security
## Disable loading of test signed kernel-drivers
bcdedit.exe /set TESTSIGNING OFF | Out-Null
bcdedit.exe /set loadoptions ENABLE_INTEGRITY_CHECKS | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Loading of test-signed kernel drivers disabled" -ForegroundColor white
## Enabling driver signature enforcement
bcdedit.exe /set nointegritychecks off | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Driver signatures enforced" -ForegroundColor white
## Enable DEP for all processes
bcdedit.exe /set "{current}" nx AlwaysOn | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled DEP for all processes" -ForegroundColor white
## Disabling crash dump generation
reg add "HKLM\SYSTEM\CurrentControlSet\control\CrashControl" /v "CrashDumpEnabled" /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled Crash dump generation" -ForegroundColor white
## Enabling automatic reboot after system crash
reg add "HKLM\SYSTEM\CurrentControlSet\Control\CrashControl" /v AutoReboot /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled automatic reboot after system crash" -ForegroundColor white
## Stopping Windows Installer from always installing w/elevated privileges
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer" /v AlwaysInstallElevated /t REG_DWORD /d 0 /f | Out-Null
reg add "HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer" /v AlwaysInstallElevated /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Set Windows Installer to install without elevated privileges" -ForegroundColor white
## Requiring a password on wakeup
powercfg -SETACVALUEINDEX SCHEME_BALANCED SUB_NONE CONSOLELOCK 1 | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled password required on wakeup" -ForegroundColor white

# Explorer/file settings
## Changing file associations to make sure they have to be executed manually
cmd /c ftype htafile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype wshfile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype wsffile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype batfile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype jsfile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype jsefile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype vbefile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
cmd /c ftype vbsfile="%SystemRoot%\system32\NOTEPAD.EXE" "%1"
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Set file associations" -ForegroundColor white
## Disabling 8.3 filename creation
reg add "HKLM\System\CurrentControlSet\Control\FileSystem" /v NtfsDisable8dot3NameCreation /t REG_DWORD /d 1 /f | Out-Null
## Removing "Run As Different User" from context menus
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoStartBanner /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Classes\batfile\shell\runasuser"	/v SuppressionPolicy /t REG_DWORD /d 4096 /f | Out-Null
reg add "HKLM\SOFTWARE\Classes\cmdfile\shell\runasuser"	/v SuppressionPolicy /t REG_DWORD /d 4096 /f | Out-Null
reg add "HKLM\SOFTWARE\Classes\exefile\shell\runasuser"	/v SuppressionPolicy /t REG_DWORD /d 4096 /f | Out-Null
reg add "HKLM\SOFTWARE\Classes\mscfile\shell\runasuser" /v SuppressionPolicy /t REG_DWORD /d 4096 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Removed 'Run As Different User' from context menus" -ForegroundColor white
## Enabling visibility of hidden files, showing file extensions
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoFolderOptions" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Folder\Hidden\NOHIDDEN" /v "CheckedValue" /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Folder\Hidden\NOHIDDEN" /v "DefaultValue" /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Folder\Hidden\SHOWALL" /v "CheckedValue" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Folder\Hidden\SHOWALL" /v "DefaultValue" /t REG_DWORD /d 2 /f | Out-Null
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "Hidden" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "ShowSuperHidden" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v "HideFileExt" /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled hidden file and file extension visibility" -ForegroundColor white
## Disabling autorun
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v NoAutoplayfornonVolume /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoAutorun /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f | Out-Null
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v NoDriveTypeAutoRun /t REG_DWORD /d 255 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled autorun" -ForegroundColor white
## Enabling DEP and heap termination on corruption for File Explorer
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v NoDataExecutionPrevention /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v NoHeapTerminationOnCorruption /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled DEP and heap termination for Explorer" -ForegroundColor white
## Enabling shell protocol protected mode
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v PreXPSP2ShellProtocolBehavior /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled shell protocol protected mode" -ForegroundColor white
## Strengthening default permissions of internal system objects
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v ProtectionMode /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled strengthening of default object permissions" -ForegroundColor white

# DLL funsies
## Enabling Safe DLL search mode
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v SafeDllSearchMode /t REG_DWORD /d 1 /f | Out-Null
## Blocking DLL loading from remote folders
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager" /v CWDIllegalInDllSearch /t REG_DWORD /d 2 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled safe DLL search mode and blocked loading from unsafe folders" -ForegroundColor white
## Blocking AppInit_DLLs
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" /v LoadAppInit_DLLs /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Windows" /v LoadAppInit_DLLs /t REG_DWORD /d 0 /f | Out-Null
# reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" /v RequireSignedAppInit_DLLs /t REG_DWORD /d 1 /f
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled APPInit DLL loading" -ForegroundColor white

# ----------- Misc registry settings ------------
## Disabling remote access to registry paths
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurePipeServers\winreg\AllowedExactPaths" /v Machine /t REG_MULTI_SZ /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurePipeServers\winreg\AllowedPaths" /v Machine /t REG_MULTI_SZ /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled remote access to registry paths" -ForegroundColor white
## Not processing RunOnce List (located at HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce, in HKCU, and Wow6432Node)
reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v DisableLocalMachineRunOnce /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v DisableLocalMachineRunOnce /t REG_DWORD /d 1 /f | Out-Null
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v DisableLocalMachineRunOnce /t REG_DWORD /d 1 /f | Out-Null
reg add "HKCU\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v DisableLocalMachineRunOnce /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled processing of RunOnce keys" -ForegroundColor white

# ----------- Misc keyboard and language fixing ------------
## Setting font registry keys
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI (TrueType)" /t REG_SZ /d "segoeui.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Black (TrueType)" /t REG_SZ /d "seguibl.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Black Italic (TrueType)" /t REG_SZ /d "seguibli.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Bold (TrueType)" /t REG_SZ /d "segoeuib.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Bold Italic (TrueType)" /t REG_SZ /d "segoeuiz.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Emoji (TrueType)" /t REG_SZ /d "seguiemj.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Historic (TrueType)" /t REG_SZ /d "seguihis.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Italic (TrueType)" /t REG_SZ /d "segoeuii.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Light (TrueType)" /t REG_SZ /d "segoeuil.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Light Italic (TrueType)" /t REG_SZ /d "seguili.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Semibold (TrueType)" /t REG_SZ /d "seguisb.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Semibold Italic (TrueType)" /t REG_SZ /d "seguisbi.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Semilight (TrueType)" /t REG_SZ /d "seguisli.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Semilight Italic (TrueType)" /t REG_SZ /d "seguisl.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Symbol (TrueType)" /t REG_SZ /d "seguisym.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe UI Variable (TrueType)" /t REG_SZ /d "segoeui.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe MDL2 Assets (TrueType)" /t REG_SZ /d "segmdl2.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe Print (TrueType)" /t REG_SZ /d "segoepr.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe Print Bold (TrueType)" /t REG_SZ /d "segoeprb.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe Script (TrueType)" /t REG_SZ /d "segoesc.ttf" /f | Out-Null
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Fonts" /v "Segoe Script Bold (TrueType)" /t REG_SZ /d "segoescb.ttf" /f | Out-Null
reg delete "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\FontSubstitutes" /v "Segoe UI" /f | Out-Null
reg add "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Font Management" /v "Auto Activation Mode" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Font Management" /v "InstallAsLink" /t REG_DWORD /d 0 /f | Out-Null
reg delete "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Font Management" /v "Inactive Fonts" /f | Out-Null
reg delete "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Font Management" /v "Active Languages" /f | Out-Null
reg delete "HKCU\Software\Microsoft\Windows NT\CurrentVersion\Font Management\Auto Activation Languages" /f | Out-Null
## Setting keyboard language to english
Remove-ItemProperty -Path 'HKCU:\Keyboard Layout\Preload' -Name * -Force | Out-Null
reg add "HKCU\Keyboard Layout\Preload" /v 1 /t REG_SZ /d "00000409" /f | Out-Null
## Setting default theme
Start-Process -Filepath "C:\Windows\Resources\Themes\aero.theme"
# Setting UI lang to english
reg add "HKCU\Control Panel\Desktop" /v PreferredUILanguages /t REG_SZ /d en-US /f | Out-Null
reg add "HKLM\Software\Policies\Microsoft\MUI\Settings" /v PreferredUILanguages /t REG_SZ /d en-US /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Font, Themes, and Languages set to default" -ForegroundColor white

# ----------- Ease of access (T1546.008) ------------
reg add "HKCU\Control Panel\Accessibility\StickyKeys" /v Flags /t REG_SZ /d 506 /f | Out-Null
reg add "HKCU\Control Panel\Accessibility\ToggleKeys" /v Flags /t REG_SZ /d 58 /f | Out-Null
reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v Flags /t REG_SZ /d 122 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Authentication\LogonUI" /v ShowTabletKeyboard /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows Embedded\EmbeddedLogon" /v BrandingNeutral /t REG_DWORD /d 8 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured Ease of Access registry keys" -ForegroundColor white

TAKEOWN /F C:\Windows\System32\sethc.exe /A | Out-Null
ICACLS C:\Windows\System32\sethc.exe /grant administrators:F | Out-Null
Remove-Item C:\Windows\System32\sethc.exe -Force | Out-Null

TAKEOWN /F C:\Windows\System32\Utilman.exe /A | Out-Null
ICACLS C:\Windows\System32\Utilman.exe /grant administrators:F | Out-Null
Remove-Item C:\Windows\System32\Utilman.exe -Force | Out-Null

TAKEOWN /F C:\Windows\System32\osk.exe /A | Out-Null
ICACLS C:\Windows\System32\osk.exe /grant administrators:F | Out-Null
Remove-Item C:\Windows\System32\osk.exe -Force | Out-Null

TAKEOWN /F C:\Windows\System32\Narrator.exe /A | Out-Null
ICACLS C:\Windows\System32\Narrator.exe /grant administrators:F | Out-Null
Remove-Item C:\Windows\System32\Narrator.exe -Force | Out-Null

TAKEOWN /F C:\Windows\System32\Magnify.exe /A | Out-Null
ICACLS C:\Windows\System32\Magnify.exe /grant administrators:F | Out-Null
Remove-Item C:\Windows\System32\Magnify.exe -Force | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Removed vulnerable accessibility features" -ForegroundColor white
# Resetting service control manager (SCM) SDDL
sc.exe sdset scmanager "D:(A;;CC;;;AU)(A;;CCLCRPRC;;;IU)(A;;CCLCRPRC;;;SU)(A;;CCLCRPWPRC;;;SY)(A;;KA;;;BA)(A;;CC;;;AC)S:(AU;FA;KA;;;WD)(AU;OIIOFA;GA;;;WD)" | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Reset SCM SDDL" -ForegroundColor white

# ----------- WINDOWS DEFENDER/antimalware settings ------------
## Enabling early launch antimalware boot-start driver scan (good, unknown, and bad but critical)
reg add "HKLM\SYSTEM\CurrentControlSet\Policies\EarlyLaunch" /v "DriverLoadPolicy" /t REG_DWORD /d 3 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled antimalware boot-start driver scan" -ForegroundColor white
## Enabling SEHOP
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\kernel" /v DisableExceptionChainValidation /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled SEHOP" -ForegroundColor white
## Starting Windows Defender service
if(!(Get-MpComputerStatus | Select-Object AntivirusEnabled)) {
    Start-Service WinDefend
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Started Windows Defender service" -ForegroundColor white
}
## Enabling Windows Defender sandboxing
cmd /c "setx /M MP_FORCE_USE_SANDBOX 1" | Out-Null
## Enabling a bunch of configuration settings
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableAntiSpyware" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "HideExclusionsFromLocalAdmins" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "ServiceKeepAlive" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\MpEngine" /v "MpCloudBlockLevel" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableBehaviorMonitoring" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableIOAVProtection" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "CheckForSignaturesBeforeRunningScan" /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "DisableHeuristics" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "DisableArchiveScanning" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "DisableBlockAtFirstSeen" /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection" /v "ForceDefenderPassiveMode" /t REG_DWORD /d 0 /f | Out-Null
## Enabling Windows Defender PUP protection (DEPRECATED, but why not leave it in just in case?)
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\MpEngine" /v "MpEnablePus" /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured Windows Defender" -ForegroundColor white
## Enabling PUA Protection
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "PUAProtection" /t REG_DWORD /d 1 /f | Out-Null
## Enabling cloud functionality of Windows Defender
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SpyNetReporting" /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SubmitSamplesConsent" /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled Windows Defender cloud functionality" -ForegroundColor white
## Enabling Defender Exploit Guard network protection
reg add "HKLM\Software\Policies\Microsoft\Windows Defender\Windows Defender Exploit Guard\Network Protection" /v EnableNetworkProtection /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled Windows Defender network protection" -ForegroundColor white
## Removing and updating Windows Defender signatures
& 'C:\Program Files\Windows Defender\MpCmdRun.exe' -RemoveDefinitions -All | Out-Null
Update-MpSignature
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Updated Windows Defender signatures" -ForegroundColor white
## Setting exploit guard settings via config file
try {
    Set-ProcessMitigation -PolicyFilePath (Join-Path -Path $ConfPath -ChildPath "def-eg-settings.xml") | Out-Null
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured Windows Defender Exploit Guard" -ForegroundColor white
} catch {
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "ERROR" -ForegroundColor red -NoNewLine; Write-Host "] Detected old Defender version, skipping configuring Exploit Guard" -ForegroundColor white
}
## Enabling ASR rules
try {
    # Block Office applications from injecting code into other processes
    Add-MpPreference -AttackSurfaceReductionRules_Ids 75668C1F-73B5-4CF0-BB93-3ECF5CB7CC84 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block Office applications from creating executable content
    Add-MpPreference -AttackSurfaceReductionRules_Ids 3B576869-A4EC-4529-8536-B80A7769E899 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block all Office applications from creating child processes
    Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EfC-AADC-AD5F3C50688A -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block JavaScript or VBScript from launching downloaded executable content
    Add-MpPreference -AttackSurfaceReductionRules_Ids D3E037E1-3EB8-44C8-A917-57927947596D -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block execution of potentially obfuscated scripts
    Add-MpPreference -AttackSurfaceReductionRules_Ids 5BEB7EFE-FD9A-4556-801D-275E5FFC04CC -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block executable content from email client and webmail
    Add-MpPreference -AttackSurfaceReductionRules_Ids BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block Win32 API calls from Office macro
    Add-MpPreference -AttackSurfaceReductionRules_Ids 92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block process creations originating from PSExec and WMI commands
    Add-MpPreference -AttackSurfaceReductionRules_Ids D1E49AAC-8F56-4280-B9BA-993A6D77406C -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block untrusted and unsigned processes that run from USB
    Add-MpPreference -AttackSurfaceReductionRules_Ids B2B3F03D-6A65-4F7B-A9C7-1C7EF74A9BA4 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Use advanced protection against ransomware
    Add-MpPreference -AttackSurfaceReductionRules_Ids C1DB55AB-C21A-4637-BB3F-A12568109D35 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block executable files from running unless they meet a prevalence, age, or trusted list criterion
    Add-MpPreference -AttackSurfaceReductionRules_Ids 01443614-CD74-433A-B99E-2ECDC07BFC25 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block credential stealing from the Windows local security authority subsystem (lsass.exe)
    Add-MpPreference -AttackSurfaceReductionRules_Ids 9E6C4E1F-7D60-472F-BA1A-A39EF669E4B2 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block Office communication application from creating child processes
    Add-MpPreference -AttackSurfaceReductionRules_Ids 26190899-1602-49E8-8B27-EB1D0A1CE869 -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block Adobe Reader from creating child processes
    Add-MpPreference -AttackSurfaceReductionRules_Ids 7674BA52-37EB-4A4F-A9A1-F0F9A1619A2C -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    # Block persistence through WMI event subscription
    Add-MpPreference -AttackSurfaceReductionRules_Ids E6DB77E5-3DF2-4CF1-B95A-636979351E5B -AttackSurfaceReductionRules_Actions Enabled | Out-Null
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled ASR rules" -ForegroundColor white
    # Removing ASR exceptions
    ForEach ($ex_asr in (Get-MpPreference).AttackSurfaceReductionOnlyExclusions) {
        Remove-MpPreference -AttackSurfaceReductionOnlyExclusions $ex_asr | Out-Null
    }
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Removed ASR exceptions" -ForegroundColor white
} catch {
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "ERROR" -ForegroundColor red -NoNewLine; Write-Host "] Detected old Defender version, skipping configuring ASR rules" -ForegroundColor white
}


## Removing exclusions in Defender
ForEach ($ex_extension in (Get-MpPreference).ExclusionExtension) {
    Remove-MpPreference -ExclusionExtension $ex_extension | Out-Null
}
ForEach ($ex_dir in (Get-MpPreference).ExclusionPath) {
    Remove-MpPreference -ExclusionPath $ex_dir | Out-Null
}
ForEach ($ex_proc in (Get-MpPreference).ExclusionProcess) {
    Remove-MpPreference -ExclusionProcess $ex_proc | Out-Null
}
ForEach ($ex_ip in (Get-MpPreference).ExclusionIpAddress) {
    Remove-MpPreference -ExclusionIpAddress $ex_ip | Out-Null
}
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Removed Defender exclusions" -ForegroundColor white
## Attempt to enable tamper protection key
reg add "HKLM\SOFTWARE\Microsoft\Windows Defender\Features" /v TamperProtection /t REG_DWORD /d 5 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "INFO" -ForegroundColor yellow -NoNewLine; Write-Host "] Tamper Protection was attempted to be set. If failed, please enable manually." -ForegroundColor white

# ----------- Service security ------------
## Stopping psexec with the power of svchost
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\PSEXESVC.exe" /v Debugger /t REG_SZ /d "svchost.exe" /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Added psexec mitigation" -ForegroundColor white
## Disabling offline files
reg add "HKLM\SYSTEM\CurrentControlSet\Services\CSC" /v Start /t REG_DWORD /d 4 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled offline files" -ForegroundColor white
## Disabling UPnP
reg add "HKLM\SOFTWARE\Microsoft\DirectPlayNATHelp\DPNHUPnP" /v UPnPMode /t REG_DWORD /d 2 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled UPnP" -ForegroundColor white
## Disabling DCOM cuz why not
reg add "HKLM\Software\Microsoft\OLE" /v EnableDCOM /t REG_SZ /d N /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled DCOM" -ForegroundColor white
## I hate print spooler
if ((Get-Service -Name spooler).Status -eq "Running") {
    Stop-Service -Name spooler -Force -PassThru | Set-Service -StartupType Disabled | Out-Null
    Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Shut down and disabled Print Spooler" -ForegroundColor white
}

## Secure channel settings
### Ensure 'Domain member: Digitally encrypt or sign secure channel data (always)' is set to 'Enabled'
reg add "HKLM\System\CurrentControlSet\Services\Netlogon\Parameters" /v RequireSignOrSeal /t REG_DWORD /d 1 /f | Out-Null
### Ensure 'Domain member: Digitally encrypt secure channel data (when possible)' is set to 'Enabled'
reg add "HKLM\System\CurrentControlSet\Services\Netlogon\Parameters" /v SealSecureChannel /t REG_DWORD /d 1 /f | Out-Null
### Ensure 'Domain member: Digitally sign secure channel data (when possible)' is set to 'Enabled'
reg add "HKLM\System\CurrentControlSet\Services\Netlogon\Parameters" /v SignSecureChannel /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled digital signing and encryption of secure channel data" -ForegroundColor white
### Disabling weak encryption protocols
#### Encryption - Ciphers: AES only - IISCrypto (recommended options)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\AES 128/128" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\AES 256/256" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\DES 56/56" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\NULL" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC2 128/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC2 40/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC2 56/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC4 128/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC4 40/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC4 56/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\RC4 64/128" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Ciphers\Triple DES 168" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SChannel encryption ciphers" -ForegroundColor white
#### Encryption - Hashes: All allowed - IISCrypto (recommended options)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Hashes\MD5" /v Enabled /t REG_DWORD /d 0x0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Hashes\SHA" /v Enabled /t REG_DWORD /d 0x0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Hashes\SHA256" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Hashes\SHA384" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Hashes\SHA512" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SChannel hashing algorithms" -ForegroundColor white
#### Encryption - Key Exchanges: All allowed
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\KeyExchangeAlgorithms\Diffie-Hellman" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\KeyExchangeAlgorithms\Diffie-Hellman" /v ServerMinKeyBitLength /t REG_DWORD /d 0x00001000 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\KeyExchangeAlgorithms\ECDH" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\KeyExchangeAlgorithms\PKCS" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SChannel key exchange algorithms" -ForegroundColor white
#### Encryption - Protocols: TLS 1.0 and higher - IISCrypto (recommended options)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\Multi-Protocol Unified Hello\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\Multi-Protocol Unified Hello\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\Multi-Protocol Unified Hello\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\Multi-Protocol Unified Hello\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\PCT 1.0\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\PCT 1.0\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\PCT 1.0\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\PCT 1.0\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 2.0\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 2.0\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 2.0\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 2.0\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 3.0\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 3.0\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 3.0\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\SSL 3.0\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.0\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Client" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Client" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v Enabled /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.1\Server" /v DisabledByDefault /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client" /v DisabledByDefault /t REG_DWORD /d 0 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v Enabled /t REG_DWORD /d 0xffffffff /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Server" /v DisabledByDefault /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SChannel encryption protocols (TLS 1.2)" -ForegroundColor white
#### Encryption - Cipher Suites (order) - All cipher included to avoid application problems
reg add "HKLM\SOFTWARE\Policies\Microsoft\Cryptography\Configuration\SSL\00010002" /v Functions /t REG_SZ /d "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_AES_256_GCM_SHA384,TLS_AES_128_GCM_SHA256,TLS_DHE_RSA_WITH_AES_256_GCM_SHA384,TLS_DHE_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_NULL_SHA256,TLS_RSA_WITH_NULL_SHA,TLS_PSK_WITH_AES_256_GCM_SHA384,TLS_PSK_WITH_AES_128_GCM_SHA256,TLS_PSK_WITH_AES_256_CBC_SHA384,TLS_PSK_WITH_AES_128_CBC_SHA256,TLS_PSK_WITH_NULL_SHA384,TLS_PSK_WITH_NULL_SHA256" /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SChannel cipher suites" -ForegroundColor white

## SMB protections
### Disable SMB compression (CVE-2020-0796 - SMBGhost)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v DisableCompression /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled SMB compression" -ForegroundColor white
### Disabling SMB1 server-side processing (Win 7 and below)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Services\LanmanServer\Parameters" /v SMB1 /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled SMB server-side processing (Win 7 and below)" -ForegroundColor white
### Disabling SMB1 client driver
reg add "HKLM\SYSTEM\CurrentControlSet\Services\MrxSmb10" /v Start /t REG_DWORD /d 4 /f | Out-Null
### Disabling client-side processing of SMBv1 protocol (pre-Win8.1/2012R2)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation" /v DependOnService /t REG_MULTI_SZ /d "Bowser\0MRxSMB20\0NSI" /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled SMBv1 client-side processing" -ForegroundColor white
### Enabling SMB2/3 and encryption (modern Windows)
Set-SmbServerConfiguration -EnableSMB2Protocol $true -Force | Out-Null
Set-SmbServerConfiguration -EncryptData $true -Force | Out-Null
### Enabling SMB2/3 (Win 7 and below)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Services\LanmanServer\Parameters" /v SMB2 /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled SMBv2/3 and data encryption" -ForegroundColor white
### Disabling sending of unencrypted passwords to third-party SMB servers
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v EnablePlainTextPassword /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled sending unencrypted password to third-party SMB servers" -ForegroundColor white
### Disallowing guest logon
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v AllowInsecureGuestAuth /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled guest logins for SMB" -ForegroundColor white
### Enable SMB signing
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v EnableSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters" /v RequireSecuritySignature /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled SMB signing" -ForegroundColor white
## Restricting access to null session pipes and shares
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanManServer\Parameters" /v RestrictNullSessAccess /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v NullSessionPipes /t REG_MULTI_SZ /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" /v NullSessionShares /t REG_MULTI_SZ /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled access to null session pipes and shares" -ForegroundColor white
## Disabling SMB admin shares (Server)
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareServer /t REG_DWORD /d 0 /f | Out-Null
## Disabling SMB admin shares (Workstation)
reg add "HKLM\System\CurrentControlSet\Services\LanmanServer\Parameters" /v AutoShareWks /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled SMB administrative shares" -ForegroundColor white
## Hide computer from browse list
reg add "HKLM\System\CurrentControlSet\Services\Lanmanserver\Parameters" /v "Hidden" /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Hidden computer from share browse list" -ForegroundColor white
## Microsoft-Windows-SMBServer\Audit event 3000 shows attempted connections [TEST]
Set-SmbServerConfiguration -AuditSmb1Access $true -Force | Out-Null

## RPC settings
### Disabling RPC usage from a remote asset interacting with scheduled tasks
reg add "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Schedule" /v DisableRpcOverTcp /t REG_DWORD /d 1 /f | Out-Null
### Disabling RPC usage from a remote asset interacting with services
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control" /v DisableRemoteScmEndpoints /t REG_DWORD /d 1 /f | Out-Null
### Restricting unauthenticated RPC clients
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Rpc" /v RestrictRemoteClients /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured RPC settings" -ForegroundColor white

## Printer NIGHTMARE NIGHTMARE NIGHTMARE
### Disabling downloading of print drivers over HTTP
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Printers" /v DisableWebPnPDownload /t REG_DWORD /d 1 /f | Out-Null
### Disabling printing over HTTP
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Printers" /v DisableHTTPPrinting /t REG_DWORD /d 1 /f | Out-Null
### Preventing regular users from installing printer drivers
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Print\Providers\LanMan Print Services\Servers" /v AddPrinterDrivers /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured printer registry keys" -ForegroundColor white

## Limiting BITS transfer
reg add "HKLM\Software\Policies\Microsoft\Windows\BITS" /v EnableBITSMaxBandwidth /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\Software\Policies\Microsoft\Windows\BITS" /v MaxTransferRateOffSchedule /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\Software\Policies\Microsoft\Windows\BITS" /v MaxDownloadTime /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Limited BITS transfer speeds" -ForegroundColor white

## Enforcing LDAP client signing (always)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\LDAP" /v LDAPClientIntegrity /t REG_DWORD /d 2 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled enforcement of LDAP client signing" -ForegroundColor white

## Prevent insecure encryption suites for Kerberos
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Kerberos\Parameters" /v "SupportedEncryptionTypes" /t REG_DWORD /d 2147483640 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled stronger encryption types for Kerberos" -ForegroundColor white

# T1557 - Countering poisoning via WPAD - Disabling WPAD
# reg add "HKLM\SYSTEM\CurrentControlSet\Services\WinHTTPAutoProxySvc" /v Start /t REG_DWORD /d 4 /f | Out-Null
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\WinHttp" /v DisableWpad /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled WPAD" -ForegroundColor white
# T1557.001 - Countering poisoning via LLMNR/NBT-NS/MDNS
## Disabling LLMNR
reg add "HKLM\Software\policies\Microsoft\Windows NT\DNSClient" /f | Out-Null
reg add "HKLM\Software\policies\Microsoft\Windows NT\DNSClient" /v EnableMulticast /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled LLMNR" -ForegroundColor white
## Disabling smart multi-homed name resolution
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" /v DisableSmartNameResolution /t REG_DWORD /d 1 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v DisableParallelAandAAAA /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled SMHNR" -ForegroundColor white
## Disabling NBT-NS via registry for all interfaces (might break something)
$regkey = "HKLM:SYSTEM\CurrentControlSet\services\NetBT\Parameters\Interfaces\"
Get-ChildItem $regkey | ForEach-Object { Set-ItemProperty -Path "$regkey\$($_.pschildname)" -Name NetbiosOptions -Value 2 | Out-Null }
## Disabling NetBIOS broadcast-based name resolution
reg add "HKLM\System\CurrentControlSet\Services\NetBT\Parameters" /v NodeType /t REG_DWORD /d 2 /f | Out-Null
## Enabling ability to ignore NetBIOS name release requests except from WINS servers
reg add "HKLM\System\CurrentControlSet\Services\NetBT\Parameters" /v NoNameReleaseOnDemand /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled NBT-NS" -ForegroundColor white
## Disabling mDNS
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters" /v EnableMDNS /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled mDNS" -ForegroundColor white

## Flushing DNS cache
ipconfig /flushdns | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Flushed DNS cache" -ForegroundColor white

## Disabling ipv6
reg add "HKLM\SYSTEM\CurrentControlSet\Services\tcpip6\Parameters" /v DisabledComponents /t REG_DWORD /d 255 /f | Out-null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled IPv6" -ForegroundColor white

## Disabling source routing for IPv4 and IPv6
reg add "HKLM\SYSTEM\CurrentControlSet\Services\tcpip\Parameters" /v DisableIPSourceRouting /t REG_DWORD /d 2 /f | Out-Null
reg add "HKLM\SYSTEM\CurrentControlSet\Services\tcpip6\Parameters" /v DisableIPSourceRouting /t REG_DWORD /d 2 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled IP source routing" -ForegroundColor white
## Disable password saving for dial-up (lol)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\RasMan\Parameters" /v DisableSavePassword /t REG_DWORD /d 1 /f | Out-Null
## Disable automatic detection of dead network gateways
reg add "HKLM\System\CurrentControlSet\Services\Tcpip\Parameters" /v EnableDeadGWDetect /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled automatic detection of dead gateways" -ForegroundColor white
## Enable ICMP redirect using OSPF
reg add "HKLM\SYSTEM\CurrentControlSet\Services\tcpip\Parameters" /v EnableICMPRedirect /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Enabled OSPF ICMP redirection" -ForegroundColor white
## Disabling IRDP
reg add "HKLM\System\CurrentControlSet\Services\Tcpip\Parameters" /v PerformRouterDiscovery /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled IRDP" -ForegroundColor white
# Disabling IGMP
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v IGMPLevel /t REG_DWORD /d 0 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Disabled IGMP" -ForegroundColor white
## Setting SYN attack protection level
reg add "HKLM\System\CurrentControlSet\Services\Tcpip\Parameters" /v SynAttackProtect /t REG_DWORD /d 1 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SYN attack protection level" -ForegroundColor white
## Setting SYN-ACK retransmissions when a connection request is not acknowledged
reg add "HKLM\System\CurrentControlSet\Services\Tcpip\Parameters" /v TcpMaxConnectResponseRetransmissions /t REG_DWORD /d 2 /f | Out-Null
Write-Host "[" -ForegroundColor white -NoNewLine; Write-Host "SUCCESS" -ForegroundColor green -NoNewLine; Write-Host "] Configured SYN-ACK retransmissions" -ForegroundColor white

# Report errors
$Error | Out-File (Join-Path -Path $currentDir -ChildPath "results\hard.txt") -Append -Encoding utf8

Write-Host "Hardening Script done! Please restart the system as soon as possible." -ForegroundColor Cyan
Write-Host "See " -NoNewline -ForegroundColor Cyan; Write-Host (Join-Path -Path $currentDir -ChildPath "results\hard.txt") -ForegroundColor Magenta -NoNewline; Write-Host " for errors." -ForegroundColor Cyan


# Prompt the user for input
$choice = Read-Host "Do you want to restart the system? (yes/y to restart)"

# Check if the user entered "yes" or "y" (case-insensitive)
if ($choice -eq "yes" -or $choice -eq "y") {
    # Restart the system
    Restart-Computer -Force
}
else {
    Write-Host "The computer will not restart. Some changes will not take affect until you have done so."
}