# Get the current domain name
$domain = ([System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain()).Name

$domainStr = $domain -Split "\."
$domainPathStr = ""
Foreach ($string in $domainStr) {
    $domainPathStr += ", DC=$string"
}

# Import the Group Policy module
Import-Module GroupPolicy
Import-Module ActiveDirectory

# Get DCIP
$DCIP = (Get-ADDomainController -Filter *).IPv4Address
# Get DCompsIP
$DComps = (Get-ADComputer -Filter * -SearchBase "CN=Computers$domainPathStr" -Properties *)

$DCompsIP = $DComps.IPv4Address

#Make New OUs
#Domain Computers
New-ADOrganizationalUnit -Name "Domain Computers"

#Domain Servers (In Domain Computers)
New-ADOrganizationalUnit -Name "Domain Servers" -Path "OU=Domain Computers$domainPathStr"

#Domain Clients (In Domain Computers)
New-ADOrganizationalUnit -Name "Domain Clients" -Path "OU=Domain Computers$domainPathStr"

Write-Host "OUs created successfully"

$serverCount = 0
$clientCount = 0
#Move Machines from Computers folder into respective OU
Foreach ($Computer in $DComps) {

    if ($Computer.OperatingSystem.Contains("Windows Server")) {
        Move-ADObject -Identity $Computer.DistinguishedName -TargetPath "OU=Domain Servers,OU=Domain Computers$domainPathStr"
        $serverCount += 1
    }
    else {
        Move-ADObject -Identity $Computer.DistinguishedName -TargetPath "OU=Domain Clients,OU=Domain Computers$domainPathStr"
        $clientCount += 1
    }
}

Write-Host "$serverCount servers and $clientCount clients moved successfully."
#Create Group Policy Objects and Link to new OUs
New-GPO -Name "Domain Computers Policy" | New-GPLink -Target "OU=Domain Computers$domainPathStr" -LinkEnabled Yes | Out-Null
New-GPO -Name "Domain Servers Policy" | New-GPLink -Target "OU=Domain Servers,OU=Domain Computers$domainPathStr" -LinkEnabled Yes | Out-Null
New-GPO -Name "Domain Clients Policy" | New-GPLink -Target "OU=Domain Clients,OU=Domain Computers$domainPathStr" -LinkEnabled Yes | Out-Null

Write-Host "GPOs created and inked successfully"

#Set Default Domain Group Policy
$PolicyStore = "$domain\Default Domain Policy"

#Set Firewall Rules
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Ping In" -Profile Any -Direction Inbound -Protocol ICMPv4 -RemoteAddress 10.120.0.0/16 -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "CCS Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 80,443 -RemoteAddress 10.120.0.111 -Program "C:\CCS.exe" -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "DNS Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 53 -RemoteAddress dns -Action Allow | Out-Null

Write-Host "All-Domain Firewall Rules Done"

#Set Default Domain Controller Group Policy
$PolicyStore = "$domain\Default Domain Controllers Policy"
#Set Firewall Rules
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RDP In" -Direction Inbound -Protocol TCP -LocalPort 3389 -Program "C:\Windows\System32\svchost.exe" -Service "termservice" -Profile Any -Action Allow | Out-Null
#Local Subnet Stuff
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "DNS In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 53 -RemoteAddress LocalSubnet -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "DHCP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 67 -RemoteAddress LocalSubnet -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "DHCP Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 68 -RemoteAddress LocalSubnet -Action Allow | Out-Null
#Domain Stuff
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos TCP In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 88 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos UDP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 88 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos UDP Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 88 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "LDAP TCP In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 389 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "LDAP UDP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 389 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "SMB In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "SMB Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 445 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RPC Map/WMI In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 135 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RPC Map/WMI Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 135 -RemoteAddress $DCompsIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "W32Time In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 123 -RemoteAddress $DCompsIP -Action Allow | Out-Null
#Inter DC Stuff
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "TCP DC File Replication In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 139 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "TCP DC File Replication Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 139 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "UDP DC File Replication In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 138 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "UDP DC File Replication Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 138 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow -Enabled False | Out-Null

Write-Host "Domain Controllers Firewall Rules Done"

#Set Domain Computers Group Policy
$PolicyStore = "$domain\Domain Computers Policy"

New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos TCP to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 88 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos UDP to DC" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 88 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Kerberos UDP from DC" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 88 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "LDAP TCP to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 389 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "LDAP UDP to DC" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 389 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "SMB to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 445 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "SMB from DC" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RPC Map/WMI to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 135 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RPC Map/WMI from DC" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 135 -RemoteAddress $DCIP -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "W32Time to DC" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 123 -RemoteAddress $DCIP -Action Allow | Out-Null

Write-Host "Domain Computers Firewall Rules Done"

#Set Domain Servers Group Policy
$PolicyStore = "$domain\Domain Servers Policy"

New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "RDP In" -Direction Inbound -Protocol TCP -LocalPort 3389 -Program "C:\Windows\System32\svchost.exe" -Service "termservice" -Profile Any -Action Allow | Out-Null
New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow  -Enabled False | Out-Null

Write-Host "Domain Servers Firewall Rules Done"

#Set Domain Clients Group Policy
$PolicyStore = "$domain\Domain Clients Policy"

New-NetFirewallRule -PolicyStore $PolicyStore -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow | Out-Null

Write-Host "Domain Clients Firewall Rules Done"