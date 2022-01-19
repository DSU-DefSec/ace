# ------- Tyler's Saucy Service Monitor -------
while($true){
$Cmp = Get-Service | Where-Object {$_.Status -eq "Running"}
#$Cmp.ToString()
while ($true) {
$Cmp2 = Get-Service | Where-Object {$_.Status -eq "Running"}
#$Cmp2.ToString()
$diff = Compare-Object -ReferenceObject $Cmp -DifferenceObject $Cmp2 -Property Name
if($diff -ne $null){
  $txt = $diff.Name + ' has started. Is this bad?'
  $option = [System.Windows.MessageBox]::Show($txt,'HACKER ALERT!!!!','YesNo','Error')
if ($option -eq "Yes"){
  Stop-Service -Name $diff.Name -Force -NoWait  
}
if ($option -eq "No"){
break
}}
sleep -Seconds 1
}}
