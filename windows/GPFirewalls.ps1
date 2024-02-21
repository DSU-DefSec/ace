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

#Move Machines from Computers folder into respective OU
Foreach ($Computer in $DComps) {

    if ($Computer.OperatingSystem.Contains("Windows Server")) {
        Move-ADObject -Identity $Computer.DistinguishedName -TargetPath "OU=Domain Servers,OU=Domain Computers$domainPathStr"
    }
    else {
    Move-ADObject -Identity $Computer.DistinguishedName -TargetPath "OU=Domain Clients,OU=Domain Computers$domainPathStr"
    }
}

#Create Group Policy Objects and Link to new OUs
New-GPO -Name "Domain Computers Policy" | New-GPLink -Target "OU=Domain Computers$domainPathStr" -LinkEnabled Yes
New-GPO -Name "Domain Servers Policy" | New-GPLink -Target "OU=Domain Servers,OU=Domain Computers$domainPathStr" -LinkEnabled Yes
New-GPO -Name "Domain Clients Policy" | New-GPLink -Target "OU=Domain Clients,OU=Domain Computers$domainPathStr" -LinkEnabled Yes

#Set Default Domain Group Policy
$PolicyStore = "$domain\Default Domain Policy"
$GPOSession = Open-NetGPO -PolicyStore $PolicyStore

#Set Firewall Rules
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Ping In" -Profile Any -Direction Inbound -Protocol ICMP -RemoteAddress 10.120.0.0/16 -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "CCS Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 80,443 -RemoteAddress 10.120.0.111 -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "DNS Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 53 -RemoteAddress dns -Action Allow

#Set Default Domain Controller Group Policy
$PolicyStore = "$domain\Default Domain Controllers Policy"
#Set Firewall Rules
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RDP In" -Direction Inbound -Protocol TCP -LocalPort 3389 -Program "C:\Windows\System32\svchost.exe" -Service "termservice" -Profile Any -Action Allow
#Local Subnet Stuff
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "DNS In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 53 -RemoteAddress LocalSubnet -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "DHCP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 67 -RemoteAddress LocalSubnet -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "DHCP Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 68 -RemoteAddress LocalSubnet -Action Allow
#Domain Stuff
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos TCP In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 88 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos UDP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 88 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos UDP Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 88 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "LDAP TCP In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 389 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "LDAP UDP In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 389 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "SMB In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "SMB Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 445 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RPC Map/WMI In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 135 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RPC Map/WMI Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 135 -RemoteAddress $DCompsIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "W32Time In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 123 -RemoteAddress $DCompsIP -Action Allow
#Inter DC Stuff
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "TCP DC File Replication In" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 139 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "TCP DC File Replication Out" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 139 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "UDP DC File Replication In" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 138 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "UDP DC File Replication Out" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 138 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow -Enabled False

#Set Domain Computers Group Policy
$PolicyStore = "$domain\Domain Computers Policy"
$GPOSession = Open-NetGPO -PolicyStore $PolicyStore
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos TCP to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 88 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos UDP to DC" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 88 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Kerberos UDP from DC" -Profile Any -Direction Inbound -Protocol UDP -LocalPort 88 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "LDAP TCP to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 389 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "LDAP UDP to DC" -Profile Any -Direction Outbound -Protocol UDP RemotePort 389 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "SMB to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 445 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "SMB from DC" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 445 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RPC Map/WMI to DC" -Profile Any -Direction Outbound -Protocol TCP -RemotePort 135 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RPC Map/WMI from DC" -Profile Any -Direction Inbound -Protocol TCP -LocalPort 135 -RemoteAddress $DCIP -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "W32Time to DC" -Profile Any -Direction Outbound -Protocol UDP -RemotePort 123 -RemoteAddress $DCIP -Action Allow

#Set Domain Servers Group Policy
$PolicyStore = "$domain\Domain Servers Policy"
$GPOSession = Open-NetGPO -PolicyStore $PolicyStore
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "RDP In" -Direction Inbound -Protocol TCP -LocalPort 3389 -Program "C:\Windows\System32\svchost.exe" -Service "termservice" -Profile Any -Action Allow
New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow -Enabled False

#Set Domain Clients Group Policy
$PolicyStore = "$domain\Domain Clients Policy"
$GPOSession = Open-NetGPO -PolicyStore $PolicyStore

New-NetFirewallRule -GPOSession $GPOSession -DisplayName "Web Out" -Direction Outbound -Protocol TCP -RemotePort 80,443 -Program "C:\Program Files\Mozilla Firefox\firefox.exe" -Profile Any -Action Allow
