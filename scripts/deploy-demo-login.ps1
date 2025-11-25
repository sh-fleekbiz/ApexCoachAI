# Deploy Demo Login Feature to Production
# This script deploys the demo login feature to Azure

param(
  [switch]$SkipBuild,
  [switch]$SkipBackend,
  [switch]$SkipFrontend,
  [switch]$SkipSeeds
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Demo Login Feature Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "apps/backend/search")) {
  Write-Host "❌ Error: Must run from project root directory" -ForegroundColor Red
  exit 1
}

# Step 1: Build all packages
if (-not $SkipBuild) {
  Write-Host "📦 Step 1: Building all packages..." -ForegroundColor Yellow
  pnpm install
  pnpm build
  if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
  }
  Write-Host "✅ Build successful" -ForegroundColor Green
  Write-Host ""
}

# Step 2: Run database migration
Write-Host "🗄️  Step 2: Database Migration" -ForegroundColor Yellow
Write-Host "   The migration SQL is ready at:" -ForegroundColor Gray
Write-Host "   apps/backend/search/migrations/001_add_demo_fields.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "   Please run this SQL against your database:" -ForegroundColor Yellow
Write-Host "   - Database: pg-shared-apps-eastus2" -ForegroundColor Gray
Write-Host "   - Database name: apex_db" -ForegroundColor Gray
Write-Host ""
$continue = Read-Host "   Have you run the migration? (y/n)"
if ($continue -ne "y") {
  Write-Host "   Please run the migration and restart the script" -ForegroundColor Yellow
  exit 0
}
Write-Host "✅ Migration confirmed" -ForegroundColor Green
Write-Host ""

# Step 3: Seed demo users
if (-not $SkipSeeds) {
  Write-Host "👥 Step 3: Seeding demo users..." -ForegroundColor Yellow
  Write-Host "   Ensure SHARED_PG_CONNECTION_STRING is set in your environment" -ForegroundColor Gray
  Write-Host ""
  $seedUsers = Read-Host "   Run seedDemoUsers.ts? (y/n)"
  if ($seedUsers -eq "y") {
    Push-Location apps/backend/search
    npx tsx scripts/seedDemoUsers.ts
    if ($LASTEXITCODE -ne 0) {
      Write-Host "   ⚠️  Seed users script failed" -ForegroundColor Yellow
    }
    else {
      Write-Host "   ✅ Demo users seeded" -ForegroundColor Green
    }
    Pop-Location
  }
  Write-Host ""

  # Step 4: Seed demo data
  Write-Host "📊 Step 4: Seeding demo data..." -ForegroundColor Yellow
  $seedData = Read-Host "   Run seedDemoData.ts? (y/n)"
  if ($seedData -eq "y") {
    Push-Location apps/backend/search
    npx tsx scripts/seedDemoData.ts
    if ($LASTEXITCODE -ne 0) {
      Write-Host "   ⚠️  Seed data script failed" -ForegroundColor Yellow
    }
    else {
      Write-Host "   ✅ Demo data seeded" -ForegroundColor Green
    }
    Pop-Location
  }
  Write-Host ""
}

# Step 5: Deploy backend
if (-not $SkipBackend) {
  Write-Host "🔧 Step 5: Deploy Backend to Azure" -ForegroundColor Yellow
  Write-Host "   Building and pushing Docker image..." -ForegroundColor Gray
  Write-Host ""
  $deployBackend = Read-Host "   Deploy backend to Azure Container App? (y/n)"
  if ($deployBackend -eq "y") {
    # Build backend Docker image
    Push-Location apps/backend/search
    Write-Host "   Building Docker image..." -ForegroundColor Gray
    docker build -t apexcoachai-search:latest -f Dockerfile ../../..

    if ($LASTEXITCODE -eq 0) {
      # Tag and push
      Write-Host "   Tagging and pushing to ACR..." -ForegroundColor Gray
      docker tag apexcoachai-search:latest shacrapps.azurecr.io/apexcoachai-search:latest
      az acr login --name shacrapps
      docker push shacrapps.azurecr.io/apexcoachai-search:latest

      # Update Container App
      Write-Host "   Updating Container App..." -ForegroundColor Gray
      az containerapp update `
        --name apexcoachai-api `
        --resource-group rg-shared-apps `
        --image shacrapps.azurecr.io/apexcoachai-search:latest `
        --set-env-vars ENABLE_DEMO_LOGIN=true

      Write-Host "   ✅ Backend deployed" -ForegroundColor Green
    }
    else {
      Write-Host "   ❌ Docker build failed" -ForegroundColor Red
    }
    Pop-Location
  }
  Write-Host ""
}

# Step 6: Deploy frontend
if (-not $SkipFrontend) {
  Write-Host "🎨 Step 6: Deploy Frontend to Azure Static Web App" -ForegroundColor Yellow
  $deployFrontend = Read-Host "   Deploy frontend? (y/n)"
  if ($deployFrontend -eq "y") {
    Write-Host "   Deploying to Azure Static Web App..." -ForegroundColor Gray
    az staticwebapp deploy `
      --name apexcoachai `
      --resource-group rg-shared-web `
      --app-location apps/frontend/dist

    if ($LASTEXITCODE -eq 0) {
      Write-Host "   ✅ Frontend deployed" -ForegroundColor Green
    }
    else {
      Write-Host "   ❌ Frontend deployment failed" -ForegroundColor Red
    }
  }
  Write-Host ""
}

# Summary
Write-Host "✨ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🧪 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Visit: https://apexcoachai.shtrial.com" -ForegroundColor Gray
Write-Host "   2. Verify three demo role buttons appear" -ForegroundColor Gray
Write-Host "   3. Test each demo role login" -ForegroundColor Gray
Write-Host "   4. Check API: https://api.apexcoachai.shtrial.com/auth/demo-users" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - DEMO_LOGIN_NEXT_STEPS.md" -ForegroundColor Gray
Write-Host "   - docs/DEMO_LOGIN_DEPLOYMENT.md" -ForegroundColor Gray
Write-Host ""
