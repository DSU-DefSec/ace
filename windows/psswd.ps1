#Will Tilstra 2025

Add-Type -AssemblyName System.Web
function Get-Password {
    do {
        $p = [System.Web.Security.Membership]::GeneratePassword(14,4)
    } while ($p -match '[,;:|iIlLoO0]')
    return $p + "1!"
}

$LocalUsers = Get-LocalUser | Where-Object { $_.Enabled -eq $true -and $_.Name -notin @('Guest', 'Deafault Account', 'WDAGUtilityAccount') }

  foreach($User in $LocalUsers){
    $q=Get-Password
    $l=Get-Password
    $p = Get-Password
    try{
      Set-LocalUser -Name $User.Name -Password (ConvertTo-SecureString $p -AsPlainText -Force)
      Set-LocalUser -Name $User.Name -Password (ConvertTo-SecureString $q -AsPlainText -Force)
      Set-LocalUser -Name $User.Name -Password (ConvertTo-SecureString $l -AsPlainText -Force)

      Write-Host "Password changed for $($User.Name)" -ForegroundColor Green
      Write-Host $l
    } catch {
      Write-Host "Password change failed for $($User.Name)" -ForegroundColor Red
    }
  }

$DomainUsers = Get-ADUser -Filter * | Where-Object { $_.SamAccountName -notmatch '\$$'}

foreach ($User in $DomainUsers) {
  $p = Get-Password
  $q=Get-Password
  $l=Get-Password
  try {
      Set-ADAccountPassword -Identity $User.SamAccountName -NewPassword (ConvertTo-SecureString $p -AsPlainText -Force) -reset
      Set-ADAccountPassword -Identity $User.SamAccountName -NewPassword (ConvertTo-SecureString $q -AsPlainText -Force) -reset
      Set-ADAccountPassword -Identity $User.SamAccountName -NewPassword (ConvertTo-SecureString $l -AsPlainText -Force) -reset

      Write-Host "Domain password changed for $($User.SamAccountName)" -ForegroundColor Green
      Write-Host $l
  } catch {
      Write-Host "Failed to change domain password for $($User.SamAccountName): $_" -ForegroundColor Red
  }
}
