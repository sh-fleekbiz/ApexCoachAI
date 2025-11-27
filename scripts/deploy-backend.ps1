param(
    [string]$SubscriptionId = "44e77ffe-2c39-4726-b6f0-2c733c7ffe78",
    [string]$AcrName = "acrsharedapps",
    [string]$ResourceGroup = "rg-shared-container-apps",
    [string]$ApiAppName = "apexcoachai-api"
)

$ErrorActionPreference = "Stop"

Write-Host "=== ApexCoachAI Backend Deployment (PowerShell) ===" -ForegroundColor Green

# Check prerequisites
foreach ($cmd in @("az", "docker")) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "Required command '$cmd' is not installed or not on PATH."
    }
}

# Ensure Azure login
Write-Host "Checking Azure CLI login..." -ForegroundColor Yellow
try {
    az account show | Out-Null
}
catch {
    az login | Out-Null
}

# Set subscription
if ($SubscriptionId) {
    Write-Host "Setting subscription to $SubscriptionId" -ForegroundColor Yellow
    az account set --subscription $SubscriptionId | Out-Null
}

Write-Host "Using ACR: $AcrName.azurecr.io" -ForegroundColor Yellow
Write-Host "Using Resource Group: $ResourceGroup" -ForegroundColor Yellow

# Login to ACR
Write-Host "Logging in to Azure Container Registry..." -ForegroundColor Yellow
az acr login --name $AcrName | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# Build and push backend API image
Write-Host "Building backend API image..." -ForegroundColor Green
docker build `
    --file apps/backend/search/Dockerfile `
    --tag "$AcrName.azurecr.io/apexcoachai-api:latest" `
    --tag "$AcrName.azurecr.io/apexcoachai-api:$timestamp" `
    --platform linux/amd64 `
    .

Write-Host "Pushing backend API image..." -ForegroundColor Green
docker push "$AcrName.azurecr.io/apexcoachai-api:latest"
docker push "$AcrName.azurecr.io/apexcoachai-api:$timestamp"

# Helper to run az containerapp update and surface 'not found' clearly
function Update-ContainerAppImage {
    param(
        [string]$Name,
        [string]$Image
    )

    Write-Host "Updating Container App '$Name' image to '$Image'..." -ForegroundColor Green
    $updateResult = az containerapp update `
        --name $Name `
        --resource-group $ResourceGroup `
        --image $Image 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Failed to update Container App '$Name'. Raw output:"
        Write-Host $updateResult
        Write-Warning "If the app does not exist yet, create it once in 'rg-shared-container-apps' using env 'cae-shared-apps-prod' and image $Image, then re-run this script."
    }
}

# Update Container App
Update-ContainerAppImage -Name $ApiAppName -Image "$AcrName.azurecr.io/apexcoachai-api:latest"

Write-Host "=== Backend deployment script completed ===" -ForegroundColor Green
Write-Host "Images tagged with: latest, $timestamp" -ForegroundColor Green
