param(
  [string]$SubscriptionId = "44e77ffe-2c39-4726-b6f0-2c733c7ffe78",
  [string]$ApiAppName = "apexcoachai-api",
  [string]$StaticWebAppName = "apexcoachai",
  [string]$ContainerAppsResourceGroup = "rg-shared-container-apps",
  [string]$StaticWebAppResourceGroup = "rg-shared-web",
  [switch]$UseLocalEnvFiles = $true
)

$ErrorActionPreference = "Stop"

Write-Host "=== ApexCoachAI Environment Configuration ===" -ForegroundColor Green

# Check prerequisites
if (-not (Get-Command "az" -ErrorAction SilentlyContinue)) {
  throw "Azure CLI 'az' is not installed or not on PATH."
}

# Ensure Azure login
Write-Host "Checking Azure CLI login..." -ForegroundColor Yellow
try {
  az account show | Out-Null
}
catch {
  Write-Host "Logging in to Azure..." -ForegroundColor Yellow
  az login | Out-Null
}

# Set subscription
if ($SubscriptionId) {
  Write-Host "Setting subscription to $SubscriptionId" -ForegroundColor Yellow
  az account set --subscription $SubscriptionId | Out-Null
}

# Function to read env file and parse variables
function Get-EnvVariables {
  param(
    [string]$EnvFilePath
  )

  $envVars = @{}

  if (Test-Path $EnvFilePath) {
    Write-Host "Reading environment variables from: $EnvFilePath" -ForegroundColor Cyan

    $content = Get-Content $EnvFilePath
    foreach ($line in $content) {
      # Skip comments and empty lines
      if ($line -match '^\s*#' -or $line -match '^\s*$') {
        continue
      }

      # Parse KEY=VALUE
      if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()

        # Remove surrounding quotes if present
        $value = $value -replace '^["'']|["'']$', ''

        if ($key -and $value -and $value -ne '<your' -and $value -ne '***') {
          $envVars[$key] = $value
        }
      }
    }
  }
  else {
    Write-Warning "Environment file not found: $EnvFilePath"
  }

  return $envVars
}

# Function to set Container App environment variables
function Set-ContainerAppEnvVariables {
  param(
    [string]$AppName,
    [hashtable]$EnvVars
  )

  Write-Host "`nConfiguring Container App: $AppName" -ForegroundColor Green

  # Convert hashtable to array of "KEY=VALUE" strings
  $envSettings = @()
  foreach ($key in $EnvVars.Keys) {
    $value = $EnvVars[$key]
    # Escape special characters for shell
    $value = $value -replace '"', '\"'
    $envSettings += "$key=$value"
  }

  if ($envSettings.Count -eq 0) {
    Write-Warning "No environment variables to set for $AppName"
    return
  }

  Write-Host "Setting $($envSettings.Count) environment variables..." -ForegroundColor Yellow

  # Build the az command
  $command = "az containerapp update --name $AppName --resource-group $ContainerAppsResourceGroup --set-env-vars"

  foreach ($setting in $envSettings) {
    $command += " `"$setting`""
  }

  try {
    Invoke-Expression $command | Out-Null
    Write-Host "✓ Successfully configured $AppName" -ForegroundColor Green
  }
  catch {
    Write-Warning "Failed to configure $AppName : $_"
  }
}

# Function to set Static Web App settings
function Set-StaticWebAppSettings {
  param(
    [string]$AppName,
    [hashtable]$EnvVars
  )

  Write-Host "`nConfiguring Static Web App: $AppName" -ForegroundColor Green

  if ($EnvVars.Count -eq 0) {
    Write-Warning "No settings to configure for $AppName"
    return
  }

  Write-Host "Setting $($EnvVars.Count) application settings..." -ForegroundColor Yellow

  # Build settings as space-separated KEY=VALUE pairs
  $settingsArray = @()
  foreach ($key in $EnvVars.Keys) {
    $value = $EnvVars[$key]
    $settingsArray += "$key=$value"
  }

  try {
    az staticwebapp appsettings set `
      --name $AppName `
      --resource-group $StaticWebAppResourceGroup `
      --setting-names $settingsArray | Out-Null

    Write-Host "✓ Successfully configured $AppName" -ForegroundColor Green
  }
  catch {
    Write-Warning "Failed to configure $AppName : $_"
  }
}

# ============================================================================
# BACKEND CONFIGURATION (Container Apps)
# ============================================================================

$backendEnvVars = @{}

if ($UseLocalEnvFiles) {
  # Read from local .env files
  Write-Host "Reading configuration from local .env files..." -ForegroundColor Cyan
  $searchEnvFile = Join-Path $PSScriptRoot "..\apps\backend\search\.env"
  $rootEnvFile = Join-Path $PSScriptRoot "..\.env"

  # Merge root and search-specific env vars
  $rootVars = Get-EnvVariables -EnvFilePath $rootEnvFile
  $searchVars = Get-EnvVariables -EnvFilePath $searchEnvFile

  # Merge (search vars override root vars)
  foreach ($key in $rootVars.Keys) {
    $backendEnvVars[$key] = $rootVars[$key]
  }
  foreach ($key in $searchVars.Keys) {
    $backendEnvVars[$key] = $searchVars[$key]
  }

  if ($backendEnvVars.Count -eq 0) {
    Write-Warning "No environment variables found in .env files. Falling back to manual entry."
    $UseLocalEnvFiles = $false
  }
}

if (-not $UseLocalEnvFiles) {
  # Use predefined values from AGENTS.md and CONFIG.md
  Write-Host "Using manual configuration entry" -ForegroundColor Cyan

  # Prompt for secrets if not in env files
  Write-Host "`nPlease provide the following Azure credentials:" -ForegroundColor Yellow
  Write-Host "(Press Enter to skip if already configured)" -ForegroundColor Gray

  $dbPassword = Read-Host "PostgreSQL Password (pgadmin@pg-shared-apps-eastus2)" -AsSecureString
  if ($dbPassword.Length -gt 0) {
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
    $dbPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    $backendEnvVars["DATABASE_URL"] = "postgresql://pgadmin:$dbPasswordPlain@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require"
    $backendEnvVars["DIRECT_URL"] = $backendEnvVars["DATABASE_URL"]
  }

  $openaiKey = Read-Host "Azure OpenAI API Key" -AsSecureString
  if ($openaiKey.Length -gt 0) {
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($openaiKey)
    $backendEnvVars["AZURE_OPENAI_API_KEY"] = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
  }

  $storageConnStr = Read-Host "Azure Storage Connection String" -AsSecureString
  if ($storageConnStr.Length -gt 0) {
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($storageConnStr)
    $backendEnvVars["AZURE_STORAGE_CONNECTION_STRING"] = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
  }

  $jwtSecret = Read-Host "JWT Secret (or press Enter to generate)" -AsSecureString
  if ($jwtSecret.Length -gt 0) {
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($jwtSecret)
    $backendEnvVars["JWT_SECRET"] = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
  }
  else {
    # Generate a random JWT secret
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $backendEnvVars["JWT_SECRET"] = [Convert]::ToBase64String($bytes)
    Write-Host "Generated JWT_SECRET: $($backendEnvVars['JWT_SECRET'])" -ForegroundColor Cyan
  }

  # Non-secret configuration
  $backendEnvVars["AZURE_OPENAI_ENDPOINT"] = "https://shared-openai-eastus2.openai.azure.com/"
  $backendEnvVars["AZURE_OPENAI_API_VERSION"] = "2025-01-01-preview"
  $backendEnvVars["AZURE_OPENAI_CHAT_DEPLOYMENT"] = "gpt-4o"
  $backendEnvVars["AZURE_OPENAI_EMBEDDING_DEPLOYMENT"] = "text-embedding-3-small"
  $backendEnvVars["AZURE_STORAGE_ACCOUNT_NAME"] = "stmahumsharedapps"
  $backendEnvVars["AZURE_STORAGE_CONTAINER"] = "apexcoachai"
  $backendEnvVars["NODE_ENV"] = "production"
  $backendEnvVars["PORT"] = "3000"
  $backendEnvVars["LOG_LEVEL"] = "info"
  $backendEnvVars["ALLOWED_ORIGINS"] = "https://apexcoachai.shtrial.com"

  # Legacy variables for backward compatibility
  $backendEnvVars["AZURE_OPENAI_SERVICE"] = "shared-openai-eastus2"
  $backendEnvVars["AZURE_STORAGE_ACCOUNT"] = "stmahumsharedapps"
}

# Configure Backend API
if ($backendEnvVars.Count -gt 0) {
  Set-ContainerAppEnvVariables -AppName $ApiAppName -EnvVars $backendEnvVars
}
else {
  Write-Warning "No backend environment variables found to configure"
}

# ============================================================================
# FRONTEND CONFIGURATION (Static Web App)
# ============================================================================

Write-Host "`n=== Frontend Configuration ===" -ForegroundColor Green

# Get backend API FQDN
Write-Host "Resolving backend API URL..." -ForegroundColor Yellow
$apiFqdn = az containerapp show `
  --name $ApiAppName `
  --resource-group $ContainerAppsResourceGroup `
  --query "properties.configuration.ingress.fqdn" -o tsv

$frontendEnvVars = @{}

if ($apiFqdn) {
  $apiUrl = "https://$apiFqdn"
  Write-Host "Backend API URL: $apiUrl" -ForegroundColor Cyan

  $frontendEnvVars["VITE_SEARCH_API_URI"] = $apiUrl
  $frontendEnvVars["BACKEND_URI"] = $apiUrl
  $frontendEnvVars["NEXT_PUBLIC_API_URL"] = $apiUrl
}
else {
  Write-Warning "Could not resolve backend API FQDN. Using default production URL."
  $frontendEnvVars["VITE_SEARCH_API_URI"] = "https://api.apexcoachai.shtrial.com"
  $frontendEnvVars["BACKEND_URI"] = "https://api.apexcoachai.shtrial.com"
  $frontendEnvVars["NEXT_PUBLIC_API_URL"] = "https://api.apexcoachai.shtrial.com"
}

# Set site URL
$frontendEnvVars["NEXT_PUBLIC_SITE_URL"] = "https://apexcoachai.shtrial.com"

# Configure Static Web App
Set-StaticWebAppSettings -AppName $StaticWebAppName -EnvVars $frontendEnvVars

# ============================================================================
# VERIFICATION
# ============================================================================

Write-Host "`n=== Configuration Verification ===" -ForegroundColor Green

Write-Host "`nContainer App Environment Variables ($ApiAppName):" -ForegroundColor Cyan
az containerapp show `
  --name $ApiAppName `
  --resource-group $ContainerAppsResourceGroup `
  --query "properties.template.containers[0].env[].name" -o tsv | Sort-Object

Write-Host "`nStatic Web App Settings ($StaticWebAppName):" -ForegroundColor Cyan
az staticwebapp appsettings list `
  --name $StaticWebAppName `
  --resource-group $StaticWebAppResourceGroup `
  --query "properties" -o json | ConvertFrom-Json | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name | Sort-Object

Write-Host "`n=== Configuration Complete ===" -ForegroundColor Green
Write-Host "`nFrontend: https://apexcoachai.shtrial.com" -ForegroundColor Green
Write-Host "Backend API: $($frontendEnvVars['VITE_SEARCH_API_URI'])" -ForegroundColor Green
Write-Host "API Docs: $($frontendEnvVars['VITE_SEARCH_API_URI'])/docs" -ForegroundColor Green

Write-Host "`n💡 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Run .\scripts\deploy-backend.ps1 to deploy backend services" -ForegroundColor Gray
Write-Host "2. Run .\scripts\deploy-frontend.ps1 to deploy frontend" -ForegroundColor Gray
Write-Host "3. Run .\scripts\smoke-test.sh to verify deployment" -ForegroundColor Gray
