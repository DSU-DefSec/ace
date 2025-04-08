# Requires Exchange Management Shell and Administrator privileges

$ErrorActionPreference = "Stop"

function Write-Log {
    param($Message)
    $logMessage = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): $Message"
    Write-Host $logMessage
    Add-Content -Path "C:\ExchangeSecurityLog.txt" -Value $logMessage
}

function Backup-ExchangeConfig {
    $backupTime = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFolder = "C:\ExchangeBackup_$backupTime"
    
    Write-Log "Creating backup folder: $backupFolder"
    New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

    try {
        Write-Log "Backing up Organization Configuration..."
        Get-OrganizationConfig | Export-Clixml "$backupFolder\OrganizationConfig.xml"

        Write-Log "Backing up Transport Configuration..."
        Get-TransportConfig | Export-Clixml "$backupFolder\TransportConfig.xml"

        Write-Log "Backing up Virtual Directories..."
        Get-OwaVirtualDirectory | Export-Clixml "$backupFolder\OwaVirtualDirectory.xml"
        Get-EcpVirtualDirectory | Export-Clixml "$backupFolder\EcpVirtualDirectory.xml"
        Get-WebServicesVirtualDirectory | Export-Clixml "$backupFolder\WebServicesVirtualDirectory.xml"
        Get-PowerShellVirtualDirectory | Export-Clixml "$backupFolder\PowerShellVirtualDirectory.xml"

        Write-Log "Backing up Malware Filter Settings..."
        Get-MalwareFilterPolicy | Export-Clixml "$backupFolder\MalwareFilterPolicy.xml"

        Write-Log "Backing up Authentication Settings..."
        Get-AuthConfig | Export-Clixml "$backupFolder\AuthConfig.xml"

        Write-Log "Backing up Transport Rules..."
        Get-TransportRule | Export-Clixml "$backupFolder\TransportRules.xml"

        $restoreScript = @"
# Exchange Configuration Restore Script
Write-Host "Restoring Exchange Configuration from backup $backupTime"
Import-Clixml "$backupFolder\OrganizationConfig.xml" | Set-OrganizationConfig
Import-Clixml "$backupFolder\TransportConfig.xml" | Set-TransportConfig
Import-Clixml "$backupFolder\AuthConfig.xml" | Set-AuthConfig

Write-Host "Configuration restored. Please review settings."
"@
        $restoreScript | Out-File "$backupFolder\RestoreConfig.ps1"

        Write-Log "Backup completed successfully to: $backupFolder"
        Write-Log "Restore script created at: $backupFolder\RestoreConfig.ps1"
        
        return $backupFolder
    }
    catch {
        Write-Log "Error during backup: $_"
        throw "Backup failed. Aborting configuration changes."
    }
}

try {
    $exchServer = Get-ExchangeServer
    Write-Log "Exchange Management Shell verified"
} catch {
    Write-Host "Error: Exchange Management Shell not loaded. Please run 'Add-PSSnapin Microsoft.Exchange.Management.PowerShell.SnapIn' first." -ForegroundColor Red
    exit
}

$config = @{}

Write-Host "`nExchange Security Configuration" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

function Get-UserInput {
    param ($prompt, $default)
    $usrinput = Read-Host "$prompt [Default: $default]"
    if ([string]::IsNullOrWhiteSpace($usrinput)) { return $default }
    return $usrinput
}

$performBackup = Get-UserInput "Create backup before making changes? (yes/no)" "yes"
if ($performBackup -eq "yes") {
    $backupLocation = Backup-ExchangeConfig
    Write-Host "Backup created at: $backupLocation" -ForegroundColor Green
    Write-Host "To restore configuration, run RestoreConfig.ps1 from the backup folder" -ForegroundColor Yellow
}

$config.DomainName = Get-UserInput "Enter external domain (e.g., mail.company.com)" "mail.company.com"
$config.EnableModernAuth = Get-UserInput "Enable Modern Authentication? (true/false)" "true"
$config.DisableLegacyAuth = Get-UserInput "Disable Legacy Authentication? (true/false)" "true"

try {
    Write-Log "Starting Exchange security configuration..."


    if ($config.EnableModernAuth -eq "true") {
        Write-Log "Enabling Modern Authentication..."
        Set-OrganizationConfig -OAuth2ClientProfileEnabled $true
    }

    if ($config.DisableLegacyAuth -eq "true") {
        Write-Log "Disabling Legacy Authentication..."
        Get-VirtualDirectory | Set-VirtualDirectory -BasicAuthentication $false -DigestAuthentication $false
        Get-VirtualDirectory | Set-VirtualDirectory -WindowsAuthentication $true
    }

    Write-Log "Enabling Audit Logging..."
    Set-AdminAuditLogConfig -AdminAuditLogEnabled $true -AdminAuditLogCmdlets * -AdminAuditLogParameters *

    Write-Log "Configuring Transport Security..."
    Set-TransportConfig -ExternalDNSServersEnabled $false

    Write-Log "Configuring Malware Filter..."
    $malwareConfig = Get-MalwareFilterPolicy Default
    if ($malwareConfig) {
        Set-MalwareFilterPolicy Default -EnableFileFilter $true -ZapEnabled $true
    } else {
        Write-Log "Warning: Default malware filter policy not found"
    }

    Write-Log "Configuring External URLs..."
    $serverName = (Get-Item ENV:COMPUTERNAME).Value
    try {
        Set-OwaVirtualDirectory "$serverName\OWA (Default Web Site)" -ExternalUrl "https://$($config.DomainName)/owa" -Force
        Set-EcpVirtualDirectory "$serverName\ECP (Default Web Site)" -ExternalUrl "https://$($config.DomainName)/ecp" -Force
    } catch {
        Write-Log "Warning: Could not set virtual directory URLs. Error: $_"
    }

    Write-Log "Exporting configuration..."
    $finalConfig = @{
        "ModernAuth" = (Get-OrganizationConfig).OAuth2ClientProfileEnabled
        "AuditLogging" = (Get-AdminAuditLogConfig).AdminAuditLogEnabled
        "ExternalDNSDisabled" = (Get-TransportConfig).ExternalDNSServersEnabled
    }

    $finalConfig | Export-Clixml "C:\ExchangeSecurityConfig.xml"
    Write-Log "Configuration exported to C:\ExchangeSecurityConfig.xml"

    Write-Log "Configuration completed successfully"
    Write-Host "`nRemember: Your configuration backup is located at: $backupLocation" -ForegroundColor Green

} catch {
    Write-Log "Error occurred: $_"
    Write-Host "Script encountered an error. Check C:\ExchangeSecurityLog.txt for details" -ForegroundColor Red
    Write-Host "To restore previous configuration, run RestoreConfig.ps1 from: $backupLocation" -ForegroundColor Yellow
}