
    $DCIP = Read-Host "Please enter the IP of the Domain Controller 1 (Hit enter if DC1)" 
    



    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v AllowTSConnections /t REG_DWORD /d 1 /f
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 1 /f
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
    reg ADD "HKLM\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v PortNumber /t REG_DWORD /d 6969 /f
    netsh advfirewall firewall set rule group="remote desktop" new enable=yes

    reg add "HKLM\SYSTEM\ControlSet001\Control\Remote Assistance" /V CreateEncryptedOnlyTickets /T REG_DWORD /D 1 /F 
    reg add "HKLM\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /V fDisableEncryption /T REG_DWORD /D 0 /F

    reg add "HKLM\SYSTEM\ControlSet001\Control\Remote Assistance" /V fAllowFullControl /T REG_DWORD /D 0 /F
    reg add "HKLM\SYSTEM\ControlSet001\Control\Remote Assistance" /V fAllowToGetHelp /T REG_DWORD /D 0 /F 
    reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /V AllowRemoteRPC /T REG_DWORD /D 0 /F 


    reg ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v fResetBroken /t REG_DWORD /d 1 /F
    reg ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v MaxConnectionTime /t REG_DWORD /d 10000 /F





    start-process powershell.exe -argument '-nologo -noprofile -executionpolicy bypass -command [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Set-MpPreference -ThreatIDDefaultAction_Ids "2147597781" -ThreatIDDefaultAction_Actions "6"; Invoke-WebRequest -Uri https://github.com/ION28/BLUESPAWN/releases/download/v0.5.1-alpha/BLUESPAWN-client-x64.exe -OutFile BLUESPAWN-client-x64.exe; & .\BLUESPAWN-client-x64.exe --monitor -a Normal --log=console,xml'


    start-process powershell.exe -argument '-nologo -noprofile -executionpolicy bypass -command [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri https://download.comodo.com/cce/download/setups/cce_public_x64.zip?track=5890 -OutFile cce_public_x64.zip; Expand-Archive cce_public_x64.zip; .\cce_public_x64\cce_2.5.242177.201_x64\cce_x64\cce.exe -u; read-host "CCE Continue When Updated"; .\cce_public_x64\cce_2.5.242177.201_x64\cce_x64\cce.exe -s \"m;f;r\" -d "c"; read-host "CCE Finished"'



    sc.exe config lanmanworkstation depend= bowser/mrxsmb20/nsi
    sc.exe config mrxsmb10 start= disabled
    Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol     
    Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force


    Set-SmbServerConfiguration -EnableSMB2Protocol $true -Force
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters" SMB2 -Type DWORD -Value 1 -Force


    net share C:\ /delete




    Set-MpPreference -ExclusionPath '<' -ExclusionProcess '<' -ExclusionExtension '<'
    Remove-MpPreference -ExclusionPath '<' -ExclusionProcess '<' -ExclusionExtension '<'


    Set-MpPreference -ThreatIDDefaultAction_Ids "0000000000" -ThreatIDDefaultAction_Actions "3"
    

    Set-MpPreference -SignatureScheduleDay Everyday -SignatureScheduleTime 120 -CheckForSignaturesBeforeRunningScan $true -DisableArchiveScanning $false -DisableAutoExclusions $false -DisableBehaviorMonitoring $false -DisableBlockAtFirstSeen $false -DisableCatchupFullScan $false -DisableCatchupQuickScan $false -DisableEmailScanning $false -DisableIOAVProtection $false -DisableIntrusionPreventionSystem $false -DisablePrivacyMode $false -DisableRealtimeMonitoring $false -DisableRemovableDriveScanning $false -DisableRestorePoint $false -DisableScanningMappedNetworkDrivesForFullScan $false -DisableScanningNetworkFiles $false -DisableScriptScanning $false -HighThreatDefaultAction Remove -LowThreatDefaultAction Quarantine -MAPSReporting 0 -ModerateThreatDefaultAction Quarantine -PUAProtection Enabled -QuarantinePurgeItemsAfterDelay 1 -RandomizeScheduleTaskTimes $false -RealTimeScanDirection 0 -RemediationScheduleDay 0 -RemediationScheduleTime 100 -ReportingAdditionalActionTimeOut 5 -ReportingCriticalFailureTimeOut 6 -ReportingNonCriticalTimeOut 7 -ScanAvgCPULoadFactor 50 -ScanOnlyIfIdleEnabled $false -ScanPurgeItemsAfterDelay 15 -ScanScheduleDay 0 -ScanScheduleQuickScanTime 200 -ScanScheduleTime 200 -SevereThreatDefaultAction Remove -SignatureAuGracePeriod 30 -SignatureUpdateCatchupInterval 1 -SignatureUpdateInterval 1 -SubmitSamplesConsent 2 -UILockdown $false -UnknownThreatDefaultAction Quarantine -Force


    start-service WinDefend
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableAntiSpyware" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "DisableAntiVirus" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender" /v "ServiceKeepAlive" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "DisableHeuristics" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Attachments" /v "ScanWithAntiVirus" /t REG_DWORD /d 3 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableRealtimeMonitoring" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Scan" /v "CheckForSignaturesBeforeRunningScan" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection" /v "DisableBehaviorMonitoring" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Reporting" /v "DisableGenericRePorts" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "LocalSettingOverrideSpynetReporting" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SubmitSamplesConsent" /t REG_DWORD /d 2 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "DisableBlockAtFirstSeen" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet" /v "SpynetReporting" /t REG_DWORD /d 0 /f


    reg ADD "HKLM\SOFTWARE\Microsoft\Windows Defender\Features" /v TamperProtection /t REG_DWORD /d 5 /F




    net start mpssvc


    Set-NetFirewallProfile (New-Object -ComObject HNetCfg.FwPolicy2).RestoreLocalFirewallDefaults()
    Disable-NetFirewallRule;


    New-NetFirewallRule -Dis "Allow TCP communication to DC" -Dir Outbound -RemotePort 389,636,3268,3269,88,53,445,135,5722,464,9389,139,49152-65535 -Prot TCP -Act Allow -RemoteAddress $DCIP
    New-NetFirewallRule -Dis "Allow UDP communication to DC" -Dir Outbound -RemotePort 389,88,53,445,123,464,138,137,49152-65535 -Prot UDP -Act Allow -RemoteAddress $DCIP

    New-NetFirewallRule -Dis "Allow TCP communication from DC" -Dir Inbound -LocalPort 389,636,3268,3269,88,53,445,135,5722,464,9389,139,49152-65535 -Prot TCP -Act Allow -RemoteAddress $DCIP
    New-NetFirewallRule -Dis "Allow UDP communication from DC" -Dir Inbound -LocalPort 389,88,53,445,123,464,138,137,49152-65535 -Prot UDP -Act Allow -RemoteAddress $DCIP


    if ($null -ne (Get-NetIPAddress | Where-Object {$_.IPAddress -eq "$DCIP"})) {
        New-NetFirewallRule -Dis "Allow TCP communication to client" -Dir Outbound -RemotePort 389,636,3268,3269,88,53,445,135,5722,464,9389,139,49152-65535 -Prot TCP -Act Allow -RemoteAddress $DCIP+"/24"
        New-NetFirewallRule -Dis "Allow UDP communication to client" -Dir Outbound -RemotePort 389,88,53,445,123,464,138,137,49152-65535 -Prot UDP -Act Allow -RemoteAddress $DCIP+"/24"
    }


    New-NetFirewallRule -Dis "Block Local Services" -Dir Outbound -RemotePort 80,443,22,21,20,110,995 -Prot TCP -Act Block -RemoteAddress $DCIP+"/24" 
    New-NetFirewallRule -Dis "Allow Remote Services" -Dir Outbound -RemotePort 80,443,22,21,20,110,995 -Prot TCP -Act Allow


    New-NetFirewallRule -Dis "Inbound Services" -Dir Inbound -LocalPort 1-10000 -Prot TCP -Act Allow


    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile /V EnableFirewall /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile /V EnableFirewall /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile /V EnableFirewall /T REG_DWORD /D 1 /F 

    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile /V DefaultInboundAction /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile /V DefaultInboundAction /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile /V DefaultInboundAction /T REG_DWORD /D 1 /F

    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile /V DefaultOutboundAction /T REG_DWORD /D 0 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile /V DefaultOutboundAction /T REG_DWORD /D 0 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile /V DefaultOutboundAction /T REG_DWORD /D 0 /F

    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PublicProfile /V DisableNotifications /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\PrivateProfile /V DisableNotifications /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile /V DisableNotifications /T REG_DWORD /D 1 /F


    Set-NetFirewallProfile -Profile Domain -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Block -NotifyOnListen False -AllowLocalFirewallRules True -AllowLocalIPsecRules True -LogFileName %SYSTEMROOT%\System32\logfiles\firewall\domainfw.log -LogMaxSizeKilobytes 16384 -LogBlocked True -LogAllowed True


    Set-NetFirewallProfile -Profile Public -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Block -NotifyOnListen True -AllowLocalFirewallRules False -AllowLocalIPsecRules False -LogFileName %SYSTEMROOT%\System32\logfiles\firewall\publicfw.log -LogMaxSizeKilobytes 16384 -LogBlocked True -LogAllowed True


    Set-NetFirewallProfile -Profile Private -Enabled True -DefaultInboundAction Block -DefaultOutboundAction Block -NotifyOnListen False -AllowLocalFirewallRules True -AllowLocalIPsecRules True -LogFileName %SYSTEMROOT%\System32\logfiles\firewall\privatefw.log -LogMaxSizeKilobytes 16384 -LogBlocked True -LogAllowed True
    

    netsh advfirewall firewall set multicastbroadcastresponse disable
    netsh advfirewall firewall set multicastbroadcastresponse mode=disable profile=all

    netsh advfirewall set Domainprofile logging filename %systemroot%\system32\LogFiles\Firewall\pfirewall.log
    netsh advfirewall set Domainprofile logging maxfilesize 20000
    netsh advfirewall set Privateprofile logging filename %systemroot%\system32\LogFiles\Firewall\pfirewall.log
    netsh advfirewall set Privateprofile logging maxfilesize 20000
    netsh advfirewall set Publicprofile logging filename %systemroot%\system32\LogFiles\Firewall\pfirewall.log
    netsh advfirewall set Publicprofile logging maxfilesize 20000
    netsh advfirewall set Publicprofile logging droppedconnections enable
    netsh advfirewall set Publicprofile logging allowedconnections enable
    netsh advfirewall set currentprofile logging filename %systemroot%\system32\LogFiles\Firewall\pfirewall.log
    netsh advfirewall set currentprofile logging maxfilesize 4096
    netsh advfirewall set currentprofile logging droppedconnections enable
    netsh advfirewall set currentprofile logging allowedconnections enable





    Set-Service -Name wuauserv -StartupType Automatic -Status Running


    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU /v AutoInstallMinorUpdates /t REG_DWORD /d 1 /f
    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU /v NoAutoUpdate /t REG_DWORD /d 0 /f
    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU /v AUOptions /t REG_DWORD /d 4 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" /v AUOptions /t REG_DWORD /d 4 /f
    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate /v ElevateNonAdmins /t REG_DWORD /d 0 /f
    reg add HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer /v NoWindowsUpdate /t REG_DWORD /d 0 /f
    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer /v NoWindowsUpdate /t REG_DWORD /d 0 /f
    reg add "HKLM\SYSTEM\Internet Communication Management\Internet Communication" /v DisableWindowsUpdateAccess /t REG_DWORD /d 0 /f
    reg add HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\WindowsUpdate /v DisableWindowsUpdateAccess /t REG_DWORD /d 0 /f
    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\WindowsUpdate /v DisableWindowsUpdateAccess /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" /V IncludeRecommendedUpdates /T REG_DWORD /D 1 /F
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update" /V ScheduledInstallTime /T REG_DWORD /D 22 /F


    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" /v "DeferFeatureUpdates" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" /v "DeferQualityUpdates" /t REG_DWORD /d 0 /f


    Remove-ItemProperty -path 'HKLM:\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters' -Name 'FullSecureChannelProtection' -Force
    New-Item -path 'HKLM:\SYSTEM\CurrentControlSet\Services\Netlogon\Parameters' -Name 'FullSecureChannelProtection' -Value 1 -ItemType "DWORD" -Force 





    Get-Service -Name Spooler | Stop-Service -Force
    Set-Service -Name Spooler -StartupType Disabled -Status Stopped


    dism /online /disable-feature /featurename:TFTP


    dism /online /disable-feature /featurename:TelnetClient
    dism /online /disable-feature /featurename:TelnetServer


    dism /online /disable-feature /featurename:"SMB1Protocol"



    Get-Service -Name RemoteRegistry | Stop-Service -Force
    Set-Service -Name RemoteRegistry -StartupType Disabled -Status Stopped


    Disable-PSRemoting -Force
    Get-Service -Name WinRM | Stop-Service -Force
    Set-Service -Name WinRM -StartupType Disabled -Status Stopped

    Remove-Item -Path WSMan:\Localhost\listener\listener* -Recurse
    Set-ItemProperty -Path HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\policies\system -Name LocalAccountTokenFilterPolicy -Value 0




    Start-Process cmd.exe -ArgumentList '/Q /k for /F "usebackq" %a in (`wmic useraccount get name ^| more +1 ^| findstr /v "^$"`) do (for /f "tokens=3,5 usebackq" %b in (`net user %a /random:12 ^| findstr ^P`) do echo %b,%c)'


    net user Guest active:no


    net user Administrator active:no


    Get-LocalGroupMember -Name Administrators | Remove-LocalGroupMember -Group Administrators -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Access Control Assistance Operators" | Remove-LocalGroupMember -Group "Access Control Assistance Operators" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Account Operators" | Remove-LocalGroupMember -Group "Account Operators" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Backup Operators" | Remove-LocalGroupMember -Group "Backup Operators" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Domain Admins " | Remove-LocalGroupMember -Group "Domain Admins " -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Domain Guests" | Remove-LocalGroupMember -Group "Domain Guests" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Enterprise Admins" | Remove-LocalGroupMember -Group "Enterprise Admins" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Guests" | Remove-LocalGroupMember -Group "Guests" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Key Admins" | Remove-LocalGroupMember -Group "Key Admins" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Schema Admins" | Remove-LocalGroupMember -Group "Schema Admins" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Remote Desktop Users" | Remove-LocalGroupMember -Group "Remote Desktop Users" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Remote Management Users" | Remove-LocalGroupMember -Group "Remote Management Users" -ErrorAction SilentlyContinue
    Get-LocalGroupMember -Name "Server Operators" | Remove-LocalGroupMember -Group "Server Operators" -ErrorAction SilentlyContinue




    net accounts /FORCELOGOFF:30 /MINPWLEN:8 /MAXPWAGE:30 /MINPWAGE:2 /UNIQUEPW:24 /lockoutwindow:30 /lockoutduration:30 /lockoutthreshold:30


    Set-ADDomainMode -identity $env:USERDNSDOMAIN -DomainMode Windows2016Domain
    $Forest = Get-ADForest
    Set-ADForestMode -Identity $Forest -Server $Forest.SchemaMaster -ForestMode Windows2016Forest


    bcdedit.exe /set "{current}" nx AlwaysOn


    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Explorer" /v "NoDataExecutionPrevention" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\System" /v "DisableHHDEP" /t REG_DWORD /d 0 /f


    reg ADD "HKLM\SYSTEM\CurrentControlSet\Control\Print\Providers\LanMan Print Services\Servers" /v AddPrinterDrivers /t REG_DWORD /d 1 /f


    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoAutorun" /t REG_DWORD /d 1 /f
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer" /v "NoDriveTypeAutoRun" /t REG_DWORD /d 255 /f


    reg ADD "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v LimitBlankPasswordUse /t REG_DWORD /d 1 /f


    reg ADD "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v AllocateCDRoms /t REG_DWORD /d 1 /f
    

    reg ADD "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" /v AutoAdminLogon /t REG_DWORD /d 0 /f


    auditpol /set /category:* /success:enable
    auditpol /set /category:* /failure:enable
    auditpol /set /subcategory:"Security State Change" /success:enable /failure:enable
    auditpol /set /subcategory:"Security System Extension" /success:enable /failure:enable
    auditpol /set /subcategory:"System Integrity" /success:enable /failure:enable
    auditpol /set /subcategory:"IPsec Driver" /success:enable /failure:enable
    auditpol /set /subcategory:"Other System Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Logon" /success:enable /failure:enable
    auditpol /set /subcategory:"Logoff" /success:enable /failure:enable
    auditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable
    auditpol /set /subcategory:"IPsec Main Mode" /success:enable /failure:enable
    auditpol /set /subcategory:"IPsec Quick Mode" /success:enable /failure:enable
    auditpol /set /subcategory:"IPsec Extended Mode" /success:enable /failure:enable
    auditpol /set /subcategory:"Special Logon" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Logon/Logoff Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Network Policy Server" /success:enable /failure:enable
    auditpol /set /subcategory:"User / Device Claims" /success:enable /failure:enable
    auditpol /set /subcategory:"Group Membership" /success:enable /failure:enable
    auditpol /set /subcategory:"File System" /success:enable /failure:enable
    auditpol /set /subcategory:"Registry" /success:enable /failure:enable
    auditpol /set /subcategory:"Kernel Object" /success:enable /failure:enable
    auditpol /set /subcategory:"SAM" /success:enable /failure:enable
    auditpol /set /subcategory:"Certification Services" /success:enable /failure:enable
    auditpol /set /subcategory:"Application Generated" /success:enable /failure:enable
    auditpol /set /subcategory:"Handle Manipulation" /success:enable /failure:enable
    auditpol /set /subcategory:"File Share" /success:enable /failure:enable
    auditpol /set /subcategory:"Filtering Platform Packet Drop" /success:enable /failure:enable
    auditpol /set /subcategory:"Filtering Platform Connection" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Object Access Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Detailed File Share" /success:enable /failure:enable
    auditpol /set /subcategory:"Removable Storage" /success:enable /failure:enable
    auditpol /set /subcategory:"Central Policy Staging" /success:enable /failure:enable
    auditpol /set /subcategory:"Sensitive Privilege Use" /success:enable /failure:enable
    auditpol /set /subcategory:"Non Sensitive Privilege Use" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Privilege Use Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Process Creation" /success:enable /failure:enable
    auditpol /set /subcategory:"Process Termination" /success:enable /failure:enable
    auditpol /set /subcategory:"DPAPI Activity" /success:enable /failure:enable
    auditpol /set /subcategory:"RPC Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Plug and Play Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Token Right Adjusted Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Audit Policy Change" /success:enable /failure:enable
    auditpol /set /subcategory:"Authentication Policy Change" /success:enable /failure:enable
    auditpol /set /subcategory:"Authorization Policy Change" /success:enable /failure:enable
    auditpol /set /subcategory:"MPSSVC Rule-Level Policy Change" /success:enable /failure:enable
    auditpol /set /subcategory:"Filtering Platform Policy Change" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Policy Change Events" /success:enable /failure:enable
    auditpol /set /subcategory:"User Account Management" /success:enable /failure:enable
    auditpol /set /subcategory:"Computer Account Management" /success:enable /failure:enable
    auditpol /set /subcategory:"Security Group Management" /success:enable /failure:enable
    auditpol /set /subcategory:"Distribution Group Management" /success:enable /failure:enable
    auditpol /set /subcategory:"Application Group Management" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Account Management Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Directory Service Access" /success:enable /failure:enable
    auditpol /set /subcategory:"Directory Service Changes" /success:enable /failure:enable
    auditpol /set /subcategory:"Directory Service Replication" /success:enable /failure:enable
    auditpol /set /subcategory:"Detailed Directory Service Replication" /success:enable /failure:enable
    auditpol /set /subcategory:"Credential Validation" /success:enable /failure:enable
    auditpol /set /subcategory:"Kerberos Service Ticket Operations" /success:enable /failure:enable
    auditpol /set /subcategory:"Other Account Logon Events" /success:enable /failure:enable
    auditpol /set /subcategory:"Kerberos Authentication Service" /success:enable /failure:enable
 


    ipconfig /flushdns
    

    attrib -r -s C:\WINDOWS\system32\drivers\etc\hosts
    cmd.exe /c "echo # > C:\Windows\System32\drivers\etc\hosts"
    attrib +r +s C:\WINDOWS\system32\drivers\etc\hosts


    reg ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v EnableLUA /t REG_DWORD /d 1 /f

    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /V ConsentPromptBehaviorAdmin /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /V ConsentPromptBehaviorUser /T REG_DWORD /D 0 /F 
    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /V FilterAdministratorToken /T REG_DWORD /D 1 /F 
    reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /V EnableVirtualization /T REG_DWORD /D 1 /F 

    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\Personalization /v NoLockScreenCamera /T REG_DWORD /D 1 /F
    reg add HKLM\SOFTWARE\Policies\Microsoft\Windows\Personalization /v NoLockScreenSlideshow /T REG_DWORD /D 1 /F
    reg add HKLM\SOFTWARE\Policies\Microsoft\InputPersonalization /v AllowInputPersonalization /T REG_DWORD /D 0 /F


    reg ADD "HKU\.DEFAULT\Control Panel\Accessibility\StickyKeys" /v Flags /t REG_SZ /d 506 /f


    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCloudSearch" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortana" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowCortanaAboveLock" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "AllowSearchToUseLocation" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "ConnectedSearchUseWeb" /t REG_DWORD /d 0 /f
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\Windows Search" /v "DisableWebSearch" /t REG_DWORD /d 1 /f





    remove-item -Force 'C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\*'
    remove-item -Force 'C:\autoexec.bat'
    remove-item -Force "C:\Users\*\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\*"
    remove-item -Force "C:\Windows\System32\GroupPolicy\Machine\Scripts\Startup"
    remove-item -Force "C:\Windows\System32\GroupPolicy\Machine\Scripts\Shutdown"
    remove-item -Force "C:\Windows\System32\GroupPolicy\User\Scripts\Logon"
    remove-item -Force "C:\Windows\System32\GroupPolicy\User\Scripts\Logoff"
    reg delete HKLM\Software\Microsoft\Windows\CurrentVersion\Run /VA /F
    reg delete HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce /VA /F 
    reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\Run /VA /F
    reg delete HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce /VA /F


    REG delete "HKLM\SYSTEM\CurrentControlSet\Control\Lsa" /v "Notification Packages"  /f



    reg delete "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\sethc.exe" /v Debugger /f
    TAKEOWN /F C:\Windows\System32\sethc.exe /A
    ICACLS C:\Windows\System32\sethc.exe /grant administrators:F
    del C:\Windows\System32\sethc.exe -Force


    TAKEOWN /F C:\Windows\System32\Utilman.exe /A
    ICACLS C:\Windows\System32\Utilman.exe /grant administrators:F
    del C:\Windows\System32\Utilman.exe -Force


    TAKEOWN /F C:\Windows\System32\osk.exe /A
    ICACLS C:\Windows\System32\osk.exe /grant administrators:F
    del C:\Windows\System32\osk.exe -Force


    TAKEOWN /F C:\Windows\System32\Narrator.exe /A
    ICACLS C:\Windows\System32\Narrator.exe /grant administrators:F
    del C:\Windows\System32\Narrator.exe -Force


    TAKEOWN /F C:\Windows\System32\Magnify.exe /A
    ICACLS C:\Windows\System32\Magnify.exe /grant administrators:F
    del C:\Windows\System32\Magnify.exe -Force


    Get-ScheduledTask | Unregister-ScheduledTask -Confirm:$false
    

    reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v Hidden /t REG_DWORD /d 1 /f
    reg add HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced /V HideFileExt /T REG_DWORD /D 0 /F
    reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced\Folder\HideFileExt" /v "CheckedValue" /t REG_DWORD /d 0 /f
    reg ADD "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced" /v ShowSuperHidden /t REG_DWORD /d 1 /F




    if ((Get-WindowsFeature Web-Server).InstallState -eq "Installed") {

        Foreach($item in (Get-ChildItem IIS:\AppPools)) { $tempPath="IIS:\AppPools\"; $tempPath+=$item.name; Set-ItemProperty -Path $tempPath -name processModel.identityType -value 4}

        Foreach($item in (Get-ChildItem IIS:\Sites)) { $tempPath="IIS:\Sites\"; $tempPath+=$item.name; Set-WebConfigurationProperty -filter /system.webServer/directoryBrowse -name enabled -PSPath $tempPath -value False}

        Set-WebConfiguration //System.WebServer/Security/Authentication/anonymousAuthentication -metadata overrideMode -value Allow -PSPath IIS:/

        Foreach($item in (Get-ChildItem IIS:\Sites)) { $tempPath="IIS:\Sites\"; $tempPath+=$item.name; Set-WebConfiguration -filter /system.webServer/security/authentication/anonymousAuthentication $tempPath -value 0}

        Set-WebConfiguration //System.WebServer/Security/Authentication/anonymousAuthentication -metadata overrideMode -value Deny-PSPath IIS:/

        $sysDrive=$Env:Path.Substring(0,3); $tempPath=((Get-WebConfiguration "//httperrors/error").prefixLanguageFilePath | Select-Object -First 1) ; $sysDrive+=$tempPath.Substring($tempPath.IndexOf('\')+1); Get-ChildItem -Path $sysDrive -Include *.* -File -Recurse | foreach { $_.Delete()}

    } 


    if (Get-Command "php.exe" -ErrorAction SilentlyContinue) {
        $Loc = php -i | find /i "configuration file" | Select-String -Pattern 'C:.*?php.ini'
        $path = ($Loc -Split "=> ")[1]
        $phpFile = "[PHP]`r`nengine = On`r`nshort_open_tag = Off`r`nprecision = 14`r`noutput_buffering = 4096`r`nzlib.output_compression = Off`r`nimplicit_flush = Off`r`nunserialize_callback_func =`r`nserialize_precision = -1`r`ndisable_functions = proc_open, popen, disk_free_space, diskfreespace, set_time_limit, leak, tmpfile, exec, system, shell_exec, passthru, show_source, system, phpinfo, pcntl_exec`r`ndisable_classes =`r`nzend.enable_gc = On`r`nexpose_php = Off`r`nmax_execution_time = 30`r`nmax_input_time = 60`r`nmemory_limit = 128M`r`nerror_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT`r`ndisplay_errors = Off`r`ndisplay_startup_errors = Off`r`nlog_errors = On`r`nlog_errors_max_len = 1024`r`nignore_repeated_errors = Off`r`nignore_repeated_source = Off`r`nvariables_order = 'GPCS'`r`nrequest_order = 'GP'`r`nregister_argc_argv = Off`r`nauto_globals_jit = On`r`npost_max_size = 8M`r`nauto_prepend_file =`r`nauto_append_file =`r`ndefault_mimetype = 'text/html'`r`ndefault_charset = 'UTF-8'`r`ndoc_root =`r`nuser_dir =`r`nenable_dl = Off`r`nfile_uploads = Off`r`nupload_max_filesize = 2M`r`nmax_file_uploads = 20`r`nallow_url_fopen = Off`r`nallow_url_include = Off`r`ndefault_socket_timeout = 60`r`n[CLI Server]`r`ncli_server.color = On`r`n[Pdo_mysql]`r`npdo_mysql.default_socket=`r`n[mail function]`r`nmail.add_x_header = Off`r`n[ODBC]`r`nodbc.allow_persistent = On`r`nodbc.check_persistent = On`r`nodbc.max_persistent = -1`r`nodbc.max_links = -1`r`nodbc.defaultlrl = 4096`r`nodbc.defaultbinmode = 1`r`n[Interbase]`r`nibase.allow_persistent = 1`r`nibase.max_persistent = -1`r`nibase.max_links = -1`r`nibase.timestampformat = '%Y-%m-%d %H:%M:%S'`r`nibase.dateformat = '%Y-%m-%d'`r`nibase.timeformat = '%H:%M:%S'`r`n[MySQLi]`r`nmysqli.max_persistent = -1`r`nmysqli.allow_persistent = On`r`nmysqli.max_links = -1`r`nmysqli.default_port = 3306`r`nmysqli.default_socket =`r`nmysqli.default_host =`r`nmysqli.default_user =`r`nmysqli.default_pw =`r`nmysqli.reconnect = Off`r`n[mysqlnd]`r`nmysqlnd.collect_statistics = On`r`nmysqlnd.collect_memory_statistics = Off`r`n[PostgreSQL]`r`npgsql.allow_persistent = On`r`npgsql.auto_reset_persistent = Off`r`npgsql.max_persistent = -1`r`npgsql.max_links = -1`r`npgsql.ignore_notice = 0`r`npgsql.log_notice = 0`r`n[bcmath]`r`nbcmath.scale = 0`r`n[Session]`r`nsession.save_handler = files`r`nsession.use_strict_mode = 1`r`nsession.use_cookies = 1`r`nsession.use_only_cookies = 1`r`nsession.name = PHPSESSID`r`nsession.auto_start = 0`r`nsession.cookie_lifetime = 14400`r`nsession.cookie_path = /`r`nsession.cookie_domain =`r`nsession.cookie_httponly = 1`r`nsession.cookie_samesite = Strict`r`nsession.serialize_handler = php`r`nsession.gc_probability = 1`r`nsession.gc_divisor = 1000`r`nsession.gc_maxlifetime = 1440`r`nsession.referer_check =`r`nsession.cache_limiter = nocache`r`nsession.cache_expire = 60`r`nsession.use_trans_sid = 0`r`nsession.sid_length = 128`r`nsession.trans_sid_tags = 'a=href,area=href,frame=src,form='`r`nsession.sid_bits_per_character = 6`r`n[Assertion]`r`nzend.assertions = -1`r`n[Tidy]`r`ntidy.clean_output = Off`r`n[ldap]`r`nldap.max_links = -1`r`n"
        $phpFile | Out-File -FilePath $path
    }




    sc.exe config trustedinstaller start= auto
    DISM /Online /Cleanup-Image /RestoreHealth
    sfc /scannow
