$format = @("\d{3}[)]?[-| |.]\d{3}[-| |.]\d{4}", "\d{3}[-| |.]\d{2}[-| |.]\d{4}")
$ErrorActionPreference = "SilentlyContinue"
$os = (Get-CimInstance Win32_OperatingSystem).Version

if ($os -ge '10.0.17134') {
    $recBin = 'C:\$Recycle.Bin'
} elseif ($os -ge '6.2.9200' -and $os -lt '10.0.17134') {
    $recBin = 'C:\$Recycle.Bin'
} else {
    $recBin = 'C:\RECYCLER'
}
Write-Host "`nOS Version is $os"
Write-Host "Recycle Bin Path: $recBin"

$netShares = Get-WmiObject Win32_Share | Where-Object { $_.Path -notlike 'C:\' -and $_.Path -notlike 'C:\Windows'-and $_.Path -notlike '' } | Select-Object -ExpandProperty Path
Write-Host "`nShares:"
foreach ($share in $netShares) {
    Write-Host $share
}

Write-Host "PII Files:"
$paths = @("C:\Users", "C:\inetpub", "C:\Windows\Temp", "$recBin") + $netShares

foreach ($path in $paths)
{
    foreach ($num in $format)
    {
        Get-ChildItem -Recurse -Force -Path "$path" | Where-Object {findstr.exe /mprc:. $_.FullName 2>$null} | 
        ForEach-Object {
            if (Select-String -Path $_.FullName -Pattern $num) {
                "$($_.FullName)"
            }
        }
    }
    Write-Host "$path completed."
}
