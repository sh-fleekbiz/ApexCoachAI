# GitHub Secrets & Variables Setup Script (PowerShell)
# Uses GitHub CLI (gh) to configure repository secrets and variables
# 
# Prerequisites:
#   1. Install GitHub CLI: https://cli.github.com/
#   2. Authenticate: gh auth login
#   3. Ensure you have admin access to the repository
#
# Usage:
#   .\scripts\setup-github-secrets.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔐 GitHub Secrets & Variables Setup for Apex Coach AI" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Check if gh CLI is installed
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "   Install from: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Check if authenticated
try {
    gh auth status 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Not authenticated"
    }
} catch {
    Write-Host "❌ Not authenticated with GitHub CLI." -ForegroundColor Red
    Write-Host "   Run: gh auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ GitHub CLI is installed and authenticated" -ForegroundColor Green
Write-Host ""

# Load secrets from .env.local if it exists
$envFile = ".env.local"
$envVars = @{}

if (Test-Path $envFile) {
    Write-Host "📖 Loading variables from $envFile..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes
            $value = $value -replace '^["'']|["'']$', ''
            if ($value -and $value -notmatch '^<PLACEHOLDER_') {
                $envVars[$key] = $value
            }
        }
    }
    Write-Host "   Loaded $($envVars.Count) variables" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: $envFile not found" -ForegroundColor Yellow
    Write-Host "   Secrets will need to be entered manually" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
}

Write-Host ""

# Function to set secret
function Set-GitHubSecret {
    param(
        [string]$SecretName,
        [string]$EnvVarName,
        [string]$Description
    )
    
    $value = $null
    if ($envVars.ContainsKey($EnvVarName)) {
        $value = $envVars[$EnvVarName]
    }
    
    if (-not $value) {
        Write-Host "⚠️  $SecretName not found in $envFile" -ForegroundColor Yellow
        Write-Host "   Description: $Description" -ForegroundColor Gray
        $value = Read-Host "   Enter value manually (or press Enter to skip)" -AsSecureString
        if ($value) {
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($value)
            $value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
        }
    }
    
    if ($value) {
        Write-Host "Setting secret: $SecretName" -ForegroundColor Cyan
        $value | gh secret set $SecretName
        Write-Host "  ✅ $SecretName set" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Skipped $SecretName" -ForegroundColor Gray
    }
}

# Function to set variable
function Set-GitHubVariable {
    param(
        [string]$VarName,
        [string]$EnvVarName,
        [string]$Description
    )
    
    $value = $null
    if ($envVars.ContainsKey($EnvVarName)) {
        $value = $envVars[$EnvVarName]
    }
    
    if (-not $value) {
        Write-Host "⚠️  $VarName not found in $envFile" -ForegroundColor Yellow
        Write-Host "   Description: $Description" -ForegroundColor Gray
        $value = Read-Host "   Enter value manually (or press Enter to skip)"
    }
    
    if ($value) {
        Write-Host "Setting variable: $VarName" -ForegroundColor Cyan
        gh variable set $VarName --body $value
        Write-Host "  ✅ $VarName set to $value" -ForegroundColor Green
    } else {
        Write-Host "  ⏭️  Skipped $VarName" -ForegroundColor Gray
    }
}

# Special handling for AZURE_CREDENTIALS (JSON format)
function Set-AzureCredentials {
    if ($envVars.ContainsKey("AZURE_CLIENT_ID") -and 
        $envVars.ContainsKey("AZURE_CLIENT_SECRET") -and 
        $envVars.ContainsKey("AZURE_TENANT_ID")) {
        
        $credentials = @{
            clientId = $envVars["AZURE_CLIENT_ID"]
            clientSecret = $envVars["AZURE_CLIENT_SECRET"]
            tenantId = $envVars["AZURE_TENANT_ID"]
        } | ConvertTo-Json -Compress
        
        Write-Host "Setting secret: AZURE_CREDENTIALS" -ForegroundColor Cyan
        $credentials | gh secret set AZURE_CREDENTIALS
        Write-Host "  ✅ AZURE_CREDENTIALS set" -ForegroundColor Green
    } else {
        Write-Host "⚠️  AZURE_CREDENTIALS components not found" -ForegroundColor Yellow
        Write-Host "   Need: AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID" -ForegroundColor Gray
        $clientId = Read-Host "   Enter AZURE_CLIENT_ID (or press Enter to skip)"
        if ($clientId) {
            $clientSecret = Read-Host "   Enter AZURE_CLIENT_SECRET" -AsSecureString
            $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($clientSecret)
            $clientSecret = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
            $tenantId = Read-Host "   Enter AZURE_TENANT_ID"
            
            $credentials = @{
                clientId = $clientId
                clientSecret = $clientSecret
                tenantId = $tenantId
            } | ConvertTo-Json -Compress
            
            $credentials | gh secret set AZURE_CREDENTIALS
            Write-Host "  ✅ AZURE_CREDENTIALS set" -ForegroundColor Green
        } else {
            Write-Host "  ⏭️  Skipped AZURE_CREDENTIALS" -ForegroundColor Gray
        }
    }
}

Write-Host "📋 Setting Repository Secrets..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

# Set secrets
Set-AzureCredentials
Set-GitHubSecret "AZURE_STATIC_WEB_APPS_API_TOKEN" "AZURE_STATIC_WEB_APPS_API_TOKEN" "Azure Static Web Apps deployment token"

Write-Host ""
Write-Host "📋 Setting Repository Variables..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

# Set variables
Set-GitHubVariable "AZURE_CLIENT_ID" "AZURE_CLIENT_ID" "Service principal client ID"
Set-GitHubVariable "AZURE_TENANT_ID" "AZURE_TENANT_ID" "Azure AD tenant ID"
Set-GitHubVariable "AZURE_SUBSCRIPTION_ID" "AZURE_SUBSCRIPTION_ID" "Azure subscription ID"
Set-GitHubVariable "AZURE_ENV_NAME" "AZURE_ENV_NAME" "Azure Developer CLI environment name (e.g., apexcoach-ai)"
Set-GitHubVariable "AZURE_LOCATION" "AZURE_LOCATION" "Azure region (e.g., eastus2)"

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Verify secrets: gh secret list" -ForegroundColor White
Write-Host "   2. Verify variables: gh variable list" -ForegroundColor White
Write-Host "   3. Test workflow: Go to Actions tab and run a workflow" -ForegroundColor White
Write-Host ""

