Function Get-SuccessfulLogins {
    param(
        [Parameter(Mandatory=$true)]
        [string]$logType
    )
    $events = Get-WinEvent -FilterHashtable @{
        LogName = $logType
        ID = 4624
    }
    return $events
}

$successfulLogins = Get-SuccessfulLogins -logType 'Security'

$users = @{}
foreach ($event in $successfulLogins) {
    $userName = $event.Properties[5].Value
    if ($users.ContainsKey($userName)) {
        $users[$userName]++
    } else {
        $users[$userName] = 1
    }
}

$sortedUsers = $users.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 10
Write-Host "Top 10 users with the most frequent logins:"
foreach ($user in $sortedUsers) {
    Write-Host "$($user.Name) : $($user.Value) logins"
}

