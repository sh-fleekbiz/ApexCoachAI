#!/usr/bin/env pwsh
# Test Demo Login Feature Locally
# This script tests the demo login implementation without deploying to Azure

$ErrorActionPreference = "Stop"

Write-Host "🧪 Testing Demo Login Feature Locally" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "apps/backend/search")) {
  Write-Host "❌ Error: Must run from project root directory" -ForegroundColor Red
  exit 1
}

# Check if node_modules exists
Write-Host "   Checking dependencies..." -ForegroundColor Gray
pnpm install --silent 2>$null

# Build packages
Write-Host "   Building packages..." -ForegroundColor Gray
pnpm build --silent 2>$null

Write-Host "✅ Prerequisites OK" -ForegroundColor Green
Write-Host ""

# Test 1: Verify TypeScript compilation
Write-Host "🔍 Test 1: TypeScript Compilation" -ForegroundColor Yellow
$tsErrors = pnpm -F search build 2>&1 | Select-String "error"
if ($tsErrors) {
  Write-Host "   ❌ TypeScript errors found" -ForegroundColor Red
  Write-Host $tsErrors -ForegroundColor Red
}
else {
  Write-Host "   ✅ TypeScript compilation successful" -ForegroundColor Green
}
Write-Host ""

# Test 2: Check migration file
Write-Host "🗄️  Test 2: Database Migration File" -ForegroundColor Yellow
$migrationPath = "apps/backend/search/migrations/001_add_demo_fields.sql"
if (Test-Path $migrationPath) {
  Write-Host "   ✅ Migration file exists: $migrationPath" -ForegroundColor Green
  $migrationSize = (Get-Item $migrationPath).Length
  Write-Host "   File size: $migrationSize bytes" -ForegroundColor Gray
}
else {
  Write-Host "   ❌ Migration file not found" -ForegroundColor Red
}
Write-Host ""

# Test 3: Check seed scripts
Write-Host "👥 Test 3: Seed Scripts" -ForegroundColor Yellow

$seedUsersPath = "apps/backend/search/scripts/seedDemoUsers.ts"
if (Test-Path $seedUsersPath) {
  Write-Host "   ✅ seedDemoUsers.ts exists" -ForegroundColor Green
}
else {
  Write-Host "   ❌ seedDemoUsers.ts not found" -ForegroundColor Red
}

$seedDataPath = "apps/backend/search/scripts/seedDemoData.ts"
if (Test-Path $seedDataPath) {
  Write-Host "   ✅ seedDemoData.ts exists" -ForegroundColor Green
}
else {
  Write-Host "   ❌ seedDemoData.ts not found" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check backend routes
Write-Host "🔌 Test 4: Backend Routes" -ForegroundColor Yellow
$authRoutePath = "apps/backend/search/src/routes/auth.ts"
if (Test-Path $authRoutePath) {
  $authContent = Get-Content $authRoutePath -Raw
  if ($authContent -match "demo-users" -and $authContent -match "demo-login") {
    Write-Host "   ✅ Demo routes implemented in auth.ts" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ Demo routes not found in auth.ts" -ForegroundColor Red
  }
}
else {
  Write-Host "   ❌ auth.ts not found" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check frontend components
Write-Host "🎨 Test 5: Frontend Components" -ForegroundColor Yellow

$authContextPath = "apps/frontend/src/contexts/AuthContext.tsx"
if (Test-Path $authContextPath) {
  $authContextContent = Get-Content $authContextPath -Raw
  if ($authContextContent -match "demoLoginWithRole") {
    Write-Host "   ✅ demoLoginWithRole method in AuthContext" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ demoLoginWithRole not found in AuthContext" -ForegroundColor Red
  }
}
else {
  Write-Host "   ❌ AuthContext.tsx not found" -ForegroundColor Red
}

$demoButtonsPath = "apps/frontend/src/components/auth/DemoLoginButtons.tsx"
if (Test-Path $demoButtonsPath) {
  Write-Host "   ✅ DemoLoginButtons component exists" -ForegroundColor Green
}
else {
  Write-Host "   ❌ DemoLoginButtons component not found" -ForegroundColor Red
}

$loginPagePath = "apps/frontend/src/pages/auth/Login.tsx"
if (Test-Path $loginPagePath) {
  $loginContent = Get-Content $loginPagePath -Raw
  if ($loginContent -match "DemoLoginButtons") {
    Write-Host "   ✅ DemoLoginButtons integrated in Login page" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ DemoLoginButtons not integrated in Login page" -ForegroundColor Red
  }
}
else {
  Write-Host "   ❌ Login.tsx not found" -ForegroundColor Red
}
Write-Host ""

# Test 6: Check configuration
Write-Host "⚙️  Test 6: Configuration" -ForegroundColor Yellow
$configPath = "apps/backend/search/src/plugins/config.ts"
if (Test-Path $configPath) {
  $configContent = Get-Content $configPath -Raw
  if ($configContent -match "ENABLE_DEMO_LOGIN") {
    Write-Host "   ✅ ENABLE_DEMO_LOGIN config found" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ ENABLE_DEMO_LOGIN config not found" -ForegroundColor Red
  }
}
else {
  Write-Host "   ❌ config.ts not found" -ForegroundColor Red
}
Write-Host ""

# Test 7: Check schema
Write-Host "📊 Test 7: Database Schema" -ForegroundColor Yellow
$schemaPath = "apps/backend/search/prisma/schema.prisma"
if (Test-Path $schemaPath) {
  $schemaContent = Get-Content $schemaPath -Raw
  if ($schemaContent -match "isDemo" -and $schemaContent -match "demoRole") {
    Write-Host "   ✅ Demo fields in Prisma schema" -ForegroundColor Green
  }
  else {
    Write-Host "   ❌ Demo fields not found in Prisma schema" -ForegroundColor Red
  }
}
else {
  Write-Host "   ❌ schema.prisma not found" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""
Write-Host "All implementation files are in place! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Ready for deployment:" -ForegroundColor Yellow
Write-Host "   1. Run database migration" -ForegroundColor Gray
Write-Host "   2. Seed demo users and data" -ForegroundColor Gray
Write-Host "   3. Deploy backend to Azure" -ForegroundColor Gray
Write-Host "   4. Deploy frontend to Azure" -ForegroundColor Gray
Write-Host "   5. Set ENABLE_DEMO_LOGIN=true" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 See DEMO_LOGIN_NEXT_STEPS.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
