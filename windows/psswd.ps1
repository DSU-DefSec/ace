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
    $p = Get-Password
    try{
      Set-LocalUser -Name $User.Name -Password (ConvertTo-SecureString $p -AsPlainText -Force)
      Write-Host "Password changed for $($User.Name)" -ForegroundColor Green
      Write-Host $p
    } catch {
      Write-Host "Password change failed for $($User.Name)" -ForegroundColor Red
    }
  }

$DomainUsers = Get-ADUser -Filter * | Where-Object { $_.SamAccountName -notmatch '\$$' -and $_.SamAccountName -ne 'Administrator' }

foreach ($User in $DomainUsers) {
  $p = Get-Password
  try {
      Set-ADAccountPassword -Identity $User.SamAccountName -NewPassword (ConvertTo-SecureString $p -AsPlainText -Force) -reset
      Write-Host "Domain password changed for $($User.SamAccountName)" -ForegroundColor Green
      Write-Host $p
  } catch {
      Write-Host "Failed to change domain password for $($User.SamAccountName): $_" -ForegroundColor Red
  }
}