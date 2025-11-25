#!/usr/bin/env pwsh
# Deploy Apex Coach AI to Azure
# This script automates the deployment process

param(
  [Parameter(Mandatory = $false)]
  [ValidateSet('all', 'frontend', 'search', 'indexer')]
  [string]$Service = 'all',

  [Parameter(Mandatory = $false)]
  [switch]$SkipBuild,

  [Parameter(Mandatory = $false)]
  [switch]$SkipTests
)

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Apex Coach AI - Azure Deployment Script      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$ACR_NAME = "shacrapps"
$ACR_LOGIN_SERVER = "shacrapps.azurecr.io"
$RESOURCE_GROUP = "rg-shared-apps"
$SWA_RESOURCE_GROUP = "rg-shared-web"
$SWA_NAME = "apexcoachai"

# Container App names
$SEARCH_APP = "apexcoachai-api"
$INDEXER_APP = "apexcoachai-indexer"

Write-Host "📋 Deployment Configuration:" -ForegroundColor Yellow
Write-Host "   Service: $Service" -ForegroundColor Gray
Write-Host "   Skip Build: $SkipBuild" -ForegroundColor Gray
Write-Host "   Skip Tests: $SkipTests" -ForegroundColor Gray
Write-Host ""

# Step 1: Pre-deployment checks
Write-Host "🔍 Step 1: Running pre-deployment checks..." -ForegroundColor Green

# Check Azure CLI
try {
  $azVersion = az version --output json | ConvertFrom-Json
  Write-Host "   ✓ Azure CLI installed: $($azVersion.'azure-cli')" -ForegroundColor Green
}
catch {
  Write-Host "   ✗ Azure CLI not found. Please install: https://aka.ms/InstallAzureCLI" -ForegroundColor Red
  exit 1
}

# Check if logged in
try {
  $account = az account show --output json | ConvertFrom-Json
  Write-Host "   ✓ Logged in as: $($account.user.name)" -ForegroundColor Green
  Write-Host "   ✓ Subscription: $($account.name)" -ForegroundColor Green
}
catch {
  Write-Host "   ✗ Not logged in to Azure. Running 'az login'..." -ForegroundColor Yellow
  az login
}

# Check Docker
if ($Service -in @('all', 'search', 'indexer')) {
  try {
    $dockerVersion = docker --version
    Write-Host "   ✓ Docker installed: $dockerVersion" -ForegroundColor Green
  }
  catch {
    Write-Host "   ✗ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
  }
}

Write-Host ""

# Step 2: Build (optional)
if (-not $SkipBuild) {
  Write-Host "🔨 Step 2: Building project..." -ForegroundColor Green

  try {
    pnpm install
    pnpm build
    Write-Host "   ✓ Build completed successfully" -ForegroundColor Green
  }
  catch {
    Write-Host "   ✗ Build failed" -ForegroundColor Red
    exit 1
  }
}
else {
  Write-Host "⏭️  Step 2: Skipping build" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Run tests (optional)
if (-not $SkipTests) {
  Write-Host "🧪 Step 3: Running tests..." -ForegroundColor Green

  try {
    pnpm test
    Write-Host "   ✓ All tests passed" -ForegroundColor Green
  }
  catch {
    Write-Host "   ✗ Tests failed" -ForegroundColor Red
    exit 1
  }
}
else {
  Write-Host "⏭️  Step 3: Skipping tests" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Deploy services
Write-Host "🚀 Step 4: Deploying to Azure..." -ForegroundColor Green

# Login to ACR
if ($Service -in @('all', 'search', 'indexer')) {
  Write-Host "   📦 Logging in to Azure Container Registry..." -ForegroundColor Cyan
  az acr login --name $ACR_NAME
}

# Deploy Search API
if ($Service -in @('all', 'search')) {
  Write-Host "   📦 Deploying Search API..." -ForegroundColor Cyan

  $searchImage = "$ACR_LOGIN_SERVER/apexcoachai-search:latest"

  Write-Host "      Building image..." -ForegroundColor Gray
  docker build -t $searchImage -f apps/backend/search/Dockerfile .

  Write-Host "      Pushing to registry..." -ForegroundColor Gray
  docker push $searchImage

  Write-Host "      Updating Container App..." -ForegroundColor Gray
  az containerapp update `
    --name $SEARCH_APP `
    --resource-group $RESOURCE_GROUP `
    --image $searchImage

  Write-Host "   ✓ Search API deployed successfully" -ForegroundColor Green
  Write-Host "   🔗 URL: https://api.apexcoachai.shtrial.com" -ForegroundColor Blue
}

# Deploy Indexer
if ($Service -in @('all', 'indexer')) {
  Write-Host "   📦 Deploying Indexer..." -ForegroundColor Cyan

  $indexerImage = "$ACR_LOGIN_SERVER/apexcoachai-indexer:latest"

  Write-Host "      Building image..." -ForegroundColor Gray
  docker build -t $indexerImage -f apps/backend/indexer/Dockerfile .

  Write-Host "      Pushing to registry..." -ForegroundColor Gray
  docker push $indexerImage

  Write-Host "      Updating Container App..." -ForegroundColor Gray
  az containerapp update `
    --name $INDEXER_APP `
    --resource-group $RESOURCE_GROUP `
    --image $indexerImage

  Write-Host "   ✓ Indexer deployed successfully" -ForegroundColor Green
}

# Deploy Frontend
if ($Service -in @('all', 'frontend')) {
  Write-Host "   📦 Deploying Frontend..." -ForegroundColor Cyan

  # Build frontend
  Write-Host "      Building frontend..." -ForegroundColor Gray
  Set-Location apps/frontend
  pnpm build
  Set-Location ../..

  # Deploy to Static Web App
  Write-Host "      Deploying to Static Web App..." -ForegroundColor Gray
  az staticwebapp deploy `
    --name $SWA_NAME `
    --resource-group $SWA_RESOURCE_GROUP `
    --app-location ./apps/frontend/dist `
    --no-wait

  Write-Host "   ✓ Frontend deployed successfully" -ForegroundColor Green
  Write-Host "   🔗 URL: https://apexcoachai.shtrial.com" -ForegroundColor Blue
}

Write-Host ""

# Step 5: Verify deployment
Write-Host "✅ Step 5: Verifying deployment..." -ForegroundColor Green

if ($Service -in @('all', 'search')) {
  Write-Host "   🔍 Checking Search API health..." -ForegroundColor Cyan
  try {
    $response = Invoke-WebRequest -Uri "https://api.apexcoachai.shtrial.com/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
      Write-Host "   ✓ Search API is healthy" -ForegroundColor Green
    }
  }
  catch {
    Write-Host "   ⚠️  Search API health check failed (may take a few minutes to start)" -ForegroundColor Yellow
  }
}

if ($Service -in @('all', 'frontend')) {
  Write-Host "   🔍 Checking Frontend..." -ForegroundColor Cyan
  try {
    $response = Invoke-WebRequest -Uri "https://apexcoachai.shtrial.com" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
      Write-Host "   ✓ Frontend is accessible" -ForegroundColor Green
    }
  }
  catch {
    Write-Host "   ⚠️  Frontend check failed (may take a few minutes to deploy)" -ForegroundColor Yellow
  }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Deployment Complete! 🎉                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Application URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: https://apexcoachai.shtrial.com" -ForegroundColor Blue
Write-Host "   Backend:  https://api.apexcoachai.shtrial.com" -ForegroundColor Blue
Write-Host "   Swagger:  https://api.apexcoachai.shtrial.com/swagger" -ForegroundColor Blue
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Verify all services are running in Azure Portal" -ForegroundColor Gray
Write-Host "   2. Check Application Insights for any errors" -ForegroundColor Gray
Write-Host "   3. Test the application functionality" -ForegroundColor Gray
Write-Host "   4. Monitor logs for any issues" -ForegroundColor Gray
Write-Host ""
