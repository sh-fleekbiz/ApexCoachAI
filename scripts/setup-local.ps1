# ApexCoachAI - Local Development Setup Script for Windows
# This script automates the initial setup process

Write-Host "=== ApexCoachAI Local Setup ===" -ForegroundColor Green
Write-Host ""

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Please run this script from the repository root" -ForegroundColor Red
    exit 1
}

# Step 1: Check prerequisites
Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Cyan

try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Node.js not found. Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

try {
    $pnpmVersion = pnpm --version
    Write-Host "  ✓ pnpm: v$pnpmVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ pnpm not found. Installing..." -ForegroundColor Yellow
    npm install -g pnpm@9.0.0
    Write-Host "  ✓ pnpm installed" -ForegroundColor Green
}

# Step 2: Check environment files
Write-Host ""
Write-Host "Step 2: Checking environment files..." -ForegroundColor Cyan

$envFiles = @(
    ".env",
    "apps\backend\search\.env",
    "apps\backend\indexer\.env",
    "apps\frontend\.env"
)

$missingEnv = $false
foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "  ✓ $envFile exists" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $envFile missing" -ForegroundColor Red
        $missingEnv = $true
    }
}

if ($missingEnv) {
    Write-Host ""
    Write-Host "Some environment files are missing. Please create them from .env.example files." -ForegroundColor Yellow
    Write-Host "See docs/demo-guide.md for instructions." -ForegroundColor Yellow
}

# Step 3: Install dependencies
Write-Host ""
Write-Host "Step 3: Installing dependencies..." -ForegroundColor Cyan
Write-Host "  This may take 2-5 minutes..." -ForegroundColor Yellow

try {
    pnpm install
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Failed to install dependencies" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    exit 1
}

# Step 4: Generate Prisma client
Write-Host ""
Write-Host "Step 4: Generating Prisma client..." -ForegroundColor Cyan

try {
    Push-Location "apps\backend\search"
    pnpm prisma generate
    Pop-Location
    Write-Host "  ✓ Prisma client generated" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Failed to generate Prisma client" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}

# Step 5: Check database connection
Write-Host ""
Write-Host "Step 5: Checking database connection..." -ForegroundColor Cyan

if (Test-Path ".env") {
    $dbUrl = Get-Content ".env" | Select-String "^DATABASE_URL=" | ForEach-Object { $_ -replace "^DATABASE_URL=", "" }
    if ($dbUrl) {
        Write-Host "  ℹ Database URL found in .env" -ForegroundColor Yellow
        Write-Host "  ⚠ Please ensure your IP is allowed in Azure PostgreSQL firewall" -ForegroundColor Yellow
    }
    else {
        Write-Host "  ✗ DATABASE_URL not found in .env" -ForegroundColor Red
    }
}
else {
    Write-Host "  ✗ .env file not found" -ForegroundColor Red
}

# Step 6: Run database migrations
Write-Host ""
Write-Host "Step 6: Running database migrations..." -ForegroundColor Cyan
Write-Host "  This will create database tables..." -ForegroundColor Yellow

$runMigrations = Read-Host "  Run migrations now? (Y/n)"
if ($runMigrations -ne "n" -and $runMigrations -ne "N") {
    try {
        Push-Location "apps\backend\search"
        pnpm prisma migrate dev --name init
        Pop-Location
        Write-Host "  ✓ Migrations completed" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Migrations failed" -ForegroundColor Red
        Write-Host "  Error: $_" -ForegroundColor Red
        Write-Host "  This is normal if migrations were already run or database is not accessible" -ForegroundColor Yellow
        Pop-Location
    }
}
else {
    Write-Host "  Skipped. Run manually with: cd apps\backend\search && pnpm prisma migrate dev" -ForegroundColor Yellow
}

# Step 7: Build check
Write-Host ""
Write-Host "Step 7: Testing build..." -ForegroundColor Cyan
Write-Host "  This may take 1-2 minutes..." -ForegroundColor Yellow

try {
    pnpm build
    Write-Host "  ✓ Build successful" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Build failed" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host "  You may still be able to run in development mode" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify environment variables in .env files" -ForegroundColor White
Write-Host "  2. Ensure your IP is allowed in Azure PostgreSQL firewall" -ForegroundColor White
Write-Host "  3. Run: pnpm dev" -ForegroundColor White
Write-Host "  4. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see: docs/demo-guide.md" -ForegroundColor Yellow
Write-Host ""

$startNow = Read-Host "Start development servers now? (y/N)"
if ($startNow -eq "y" -or $startNow -eq "Y") {
    Write-Host ""
    Write-Host "Starting development servers..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    pnpm dev
}
