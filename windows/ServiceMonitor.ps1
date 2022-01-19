# ------- Tyler's Saucy Service Monitor -------
Add-Type -AssemblyName System.Windows.Forms | Out-Null
[System.Windows.Forms.Application]::EnableVisualStyles()
$btn = [System.Windows.Forms.MessageBoxButtons]::YESNO
$ico = [System.Windows.Forms.MessageBoxIcon]::Warning
$Title = 'Hacker Alert!!!!'
while($true){
$Cmp = Get-Service | Where-Object {$_.Status -eq "Running"}
#$Cmp.ToString()
while ($true) {
$Cmp2 = Get-Service | Where-Object {$_.Status -eq "Running"}
#$Cmp2.ToString()
$diff = Compare-Object -ReferenceObject $Cmp -DifferenceObject $Cmp2 -Property Name
if($diff -ne $null){
  $Message = $diff.Name + ' has started. Kill This Service?'
  $Return = [System.Windows.Forms.MessageBox]::Show($Message, $Title, $btn, $ico)
if ($Return -eq "Yes"){
  Stop-Service -Name $diff.Name -Force -NoWait  
}
if ($Return -eq "No"){
break
}}
sleep -Seconds 1
}}
