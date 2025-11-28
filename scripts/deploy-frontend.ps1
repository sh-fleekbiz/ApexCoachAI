param(
    [string]$SubscriptionId = "44e77ffe-2c39-4726-b6f0-2c733c7ffe78",
    [string]$StaticWebAppName = "apexcoachai",
    [string]$StaticWebAppResourceGroup = "rg-shared-web",
    [string]$ApiAppName = "apexcoachai-api",
    [string]$ApiResourceGroup = "rg-shared-container-apps"
)

$ErrorActionPreference = "Stop"

Write-Host "=== ApexCoachAI Frontend Deployment (PowerShell) ===" -ForegroundColor Green

# Check prerequisites
foreach ($cmd in @("node", "pnpm", "az")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "Required command '$cmd' is not installed or not on PATH."
    }
}

# Ensure Azure login
Write-Host "Checking Azure CLI login..." -ForegroundColor Yellow
try {
    az account show | Out-Null
} catch {
    az login | Out-Null
}

# Set subscription
if ($SubscriptionId) {
    Write-Host "Setting subscription to $SubscriptionId" -ForegroundColor Yellow
    az account set --subscription $SubscriptionId | Out-Null
}

# Resolve backend API FQDN
Write-Host "Resolving backend API FQDN from Container App '$ApiAppName'..." -ForegroundColor Yellow
$fqdn = ""
try {
    $fqdn = az containerapp show `
        --name $ApiAppName `
        --resource-group $ApiResourceGroup `
        --query "properties.configuration.ingress.fqdn" -o tsv
} catch {
    Write-Warning "Failed to resolve Container App FQDN for $ApiAppName in $ApiResourceGroup. The frontend will fall back to its hardcoded production API URL (may still cause 'Failed to fetch')."
}

if ($fqdn) {
    $env:BACKEND_URI = "https://$fqdn"
    Write-Host "Using BACKEND_URI=$($env:BACKEND_URI) for frontend build." -ForegroundColor Green
} else {
    Write-Warning "BACKEND_URI not set because FQDN lookup failed. Ensure the Container App '$ApiAppName' exists and has external ingress enabled."
}

# Build frontend
Push-Location apps/web

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
pnpm install

Write-Host "Building production bundle..." -ForegroundColor Green
pnpm build

if (-not (Test-Path "dist")) {
    throw "Build failed - 'dist' directory not found."
}

Write-Host "Fetching Static Web App deployment token..." -ForegroundColor Yellow
$deploymentToken = az staticwebapp secrets list `
  --name $StaticWebAppName `
  --resource-group $StaticWebAppResourceGroup `
  --query "properties.apiKey" -o tsv

if (-not $deploymentToken) {
  throw "Failed to retrieve deployment token for Static Web App '$StaticWebAppName'."
}

if (-not (Get-Command "swa" -ErrorAction SilentlyContinue)) {
  throw "Static Web Apps CLI 'swa' is not installed. Install it with: npm install -g @azure/static-web-apps-cli"
}

Write-Host "Deploying to Azure Static Web App '$StaticWebAppName' using SWA CLI..." -ForegroundColor Yellow
swa deploy ./dist `
  --deployment-token $deploymentToken `
  --app-name $StaticWebAppName `
  --env production

Pop-Location

Write-Host "=== Frontend deployment script completed ===" -ForegroundColor Green
Write-Host "Frontend URL: https://apexcoachai.shtrial.com" -ForegroundColor Green
