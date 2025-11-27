# ApexCoachAI - Environment Status Check

Write-Host "=== ApexCoachAI Environment Status ===" -ForegroundColor Cyan
Write-Host ""

# Check Node and pnpm
Write-Host "Prerequisites:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ Node.js not installed" -ForegroundColor Red
}

try {
    $pnpmVersion = pnpm --version
    Write-Host "  ✓ pnpm: v$pnpmVersion" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ pnpm not installed" -ForegroundColor Red
}

# Check environment files
Write-Host ""
Write-Host "Environment Files:" -ForegroundColor Yellow

$envFiles = @{
    "Root .env"       = ".env"
    "Search API .env" = "apps\backend\search\.env"
    "Indexer .env"    = "apps\backend\indexer\.env"
    "Frontend .env"   = "apps\frontend\.env"
}

foreach ($name in $envFiles.Keys) {
    $path = $envFiles[$name]
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        Write-Host "  ✓ $name ($size bytes)" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $name missing" -ForegroundColor Red
    }
}

# Check node_modules
Write-Host ""
Write-Host "Dependencies:" -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules installed" -ForegroundColor Green
}
else {
    Write-Host "  ✗ node_modules not found - run: pnpm install" -ForegroundColor Red
}

# Check Prisma client
Write-Host ""
Write-Host "Database:" -ForegroundColor Yellow
if (Test-Path "apps\backend\search\node_modules\.prisma\client") {
    Write-Host "  ✓ Prisma client generated" -ForegroundColor Green
}
else {
    Write-Host "  ✗ Prisma client not generated - run: cd apps\backend\search && pnpm prisma generate" -ForegroundColor Red
}

# Check if migrations exist
if (Test-Path "apps\backend\search\prisma\migrations") {
    $migrations = Get-ChildItem "apps\backend\search\prisma\migrations" -Directory
    Write-Host "  ℹ Migrations: $($migrations.Count) found" -ForegroundColor Cyan
}
else {
    Write-Host "  ⚠ No migrations directory found" -ForegroundColor Yellow
}

# Check dist folders (built)
Write-Host ""
Write-Host "Build Status:" -ForegroundColor Yellow

$distFolders = @{
    "Frontend"   = "apps\frontend\dist"
    "Search API" = "apps\backend\search\dist"
    "Indexer"    = "apps\backend\indexer\dist"
}

foreach ($name in $distFolders.Keys) {
    $path = $distFolders[$name]
    if (Test-Path $path) {
        Write-Host "  ✓ $name built" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ $name not built" -ForegroundColor Yellow
    }
}

# Check required environment variables
Write-Host ""
Write-Host "Required Environment Variables:" -ForegroundColor Yellow

if (Test-Path ".env") {
    $requiredVars = @(
        "DATABASE_URL",
        "DIRECT_URL",
        "AZURE_OPENAI_API_KEY",
        "AZURE_STORAGE_CONNECTION_STRING",
        "JWT_SECRET"
    )

    $envContent = Get-Content ".env"

    foreach ($var in $requiredVars) {
        $found = $envContent | Select-String "^$var="
        if ($found -and $found -notmatch "<.*>") {
            Write-Host "  ✓ $var set" -ForegroundColor Green
        }
        else {
            Write-Host "  ✗ $var missing or placeholder" -ForegroundColor Red
        }
    }
}

# Summary
Write-Host ""
Write-Host "=== Quick Actions ===" -ForegroundColor Cyan
Write-Host "  Setup:    .\scripts\setup-local.ps1" -ForegroundColor White
Write-Host "  Start:    pnpm dev" -ForegroundColor White
Write-Host "  Build:    pnpm build" -ForegroundColor White
Write-Host "  Test:     pnpm test:e2e" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: docs/demo-guide.md" -ForegroundColor Yellow
Write-Host ""
