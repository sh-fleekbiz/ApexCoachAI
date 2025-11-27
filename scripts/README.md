# ApexCoachAI Scripts

This directory contains automation scripts for setup, deployment, and testing.

## Local Development Scripts (PowerShell - Windows)

### setup-local.ps1

**Automated local development environment setup**

Performs complete setup:

- Checks prerequisites (Node.js, pnpm)
- Verifies environment files
- Installs dependencies
- Generates Prisma client
- Runs database migrations
- Tests build
- Optionally starts dev servers

**Usage**:

```powershell
.\scripts\setup-local.ps1
```

**When to use**: First time setup or after fresh git clone

---

### check-status.ps1

**Environment and setup status checker**

Verifies:

- Prerequisites installed
- Environment files exist
- Dependencies installed
- Prisma client generated
- Build status
- Required environment variables set

**Usage**:

```powershell
.\scripts\check-status.ps1
```

**When to use**: Before starting development, troubleshooting issues

---

## Environment Configuration Scripts (PowerShell - Windows)

### configure-env-variables.ps1

**Configure environment variables for all services**

Performs:

- Prompts for Azure credentials (if not using local .env files)
- Configures Container Apps environment variables (backend API and indexer)
- Configures Static Web App settings (frontend)
- Resolves backend API URL automatically
- Verifies configuration after setup

**Usage**:

```powershell
# Interactive mode (prompts for credentials)
.\scripts\configure-env-variables.ps1

# Using local .env files
.\scripts\configure-env-variables.ps1 -UseLocalEnvFiles
```

**What it configures**:

- **Backend Services**: DATABASE_URL, Azure OpenAI, Azure Search, Storage, JWT secret, etc.
- **Frontend**: API URLs (VITE_SEARCH_API_URI, BACKEND_URI, etc.)

**When to use**: Before deploying, when updating credentials, or when environment variables are missing

---

## Deployment Scripts

### deploy-backend.ps1 (PowerShell - Windows)

**Deploy backend services to Azure Container Apps**

Performs:

- Builds Docker images for search API and indexer
- Pushes images to Azure Container Registry
- Updates Azure Container Apps
- Verifies deployment health

**Usage**:

```powershell
.\scripts\deploy-backend.ps1
```

**Prerequisites**:

- Azure CLI authenticated
- Docker installed
- Access to Azure Container Registry
- Environment variables configured (run `configure-env-variables.ps1` first)

---

### deploy-frontend.ps1 (PowerShell - Windows)

**Deploy frontend to Azure Static Web App**

Performs:

- Resolves backend API URL from Container Apps
- Installs dependencies
- Builds production bundle with correct API URL
- Deploys to Azure Static Web App
- Verifies deployment

**Usage**:

```powershell
.\scripts\deploy-frontend.ps1
```

**Prerequisites**:

- Node.js and pnpm installed
- Azure CLI authenticated
- SWA CLI installed (`npm install -g @azure/static-web-apps-cli`)
- Environment variables configured (run `configure-env-variables.ps1` first)

---

### deploy-backend.sh (Bash - Linux/Mac/WSL)

**Deploy backend services to Azure Container Apps**

Legacy bash version of deployment script.

**Usage**:

```bash
chmod +x scripts/deploy-backend.sh
./scripts/deploy-backend.sh
```

**Note**: PowerShell version is recommended for Windows.

---

### deploy-frontend.sh (Bash - Linux/Mac/WSL)

**Deploy frontend to Azure Static Web App**

Legacy bash version of deployment script.

**Usage**:

```bash
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh
```

**Note**: PowerShell version is recommended for Windows.

---

### deploy-full.sh (Bash - Linux/Mac/WSL)

**Full-stack deployment (backend + frontend)**

Orchestrates:

- Backend deployment
- 30-second pause
- Frontend deployment
- Summary report

**Usage**:

```bash
chmod +x scripts/deploy-full.sh
./scripts/deploy-full.sh
```

**When to use**: Complete application deployment

**Note**: For Windows, run scripts separately:

```powershell
.\scripts\configure-env-variables.ps1
.\scripts\deploy-backend.ps1
.\scripts\deploy-frontend.ps1
```

---

### smoke-test.sh

**Post-deployment smoke tests**

Tests:

- API health endpoint
- API documentation accessibility
- Frontend loads
- CORS headers present
- API response time

**Usage**:

```bash
chmod +x scripts/smoke-test.sh
./scripts/smoke-test.sh
```

**When to use**: After deployment to verify everything works

**Exit codes**:

- 0: All tests passed
- 1: One or more tests failed

---

## Data Scripts

### ingest-coaching-content.js

**Content ingestion utility**

(Documentation pending - check file for usage)

---

## Script Dependencies

### PowerShell Scripts Requirements

- Windows OS
- PowerShell 5.1 or higher
- Node.js 20+
- pnpm 9.0.0+

### Bash Scripts Requirements

- Linux/Mac/WSL
- Bash 4.0 or higher
- Azure CLI
- Docker (for deployment)
- Node.js 20+ (for frontend deployment)

---

## Quick Start

### First Time Setup

```powershell
# Windows
.\scripts\setup-local.ps1

# Follow prompts for database migration
# Start dev servers when prompted
```

### Check Environment

```powershell
# Windows
.\scripts\check-status.ps1
```

### Deploy to Production

```powershell
# Windows (Recommended)
# Step 1: Configure environment variables
.\scripts\configure-env-variables.ps1

# Step 2: Deploy backend services
.\scripts\deploy-backend.ps1

# Step 3: Deploy frontend
.\scripts\deploy-frontend.ps1

# Step 4: Verify deployment
bash .\scripts\smoke-test.sh
```

```bash
# Linux/Mac/WSL (Alternative)
./scripts/deploy-full.sh

# Then verify
./scripts/smoke-test.sh
```

---

## Troubleshooting

### PowerShell Execution Policy

If scripts won't run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Bash Script Permissions

If scripts are not executable:

```bash
chmod +x scripts/*.sh
```

### Script Hangs or Fails

1. Check status first:

   ```powershell
   .\scripts\check-status.ps1
   ```

2. Review error messages carefully

3. See troubleshooting sections in:
   - `docs/demo-guide.md`
   - `docs/deployment-manual.md`

---

## Adding New Scripts

When adding scripts to this directory:

1. **Name clearly**: Use descriptive names (e.g., `setup-local.ps1`, not `setup.ps1`)
2. **Add documentation**: Update this README
3. **Include comments**: Add header comments in the script
4. **Error handling**: Use `set -e` (bash) or `$ErrorActionPreference = "Stop"` (PowerShell)
5. **Output formatting**: Use colors and clear messages
6. **Test thoroughly**: Test on clean environment

---

## Documentation References

- **Deployment Guide**: `docs/DEPLOYMENT_GUIDE.md` - **START HERE for deployment**
- **Local Development**: `docs/demo-guide.md`
- **Manual Deployment**: `docs/deployment-manual.md`
- **Configuration**: `docs/CONFIG.md`
- **Issues**: `docs/apexcoachai_issues.md`

---

**Maintained by**: ApexCoachAI Team
**Last Updated**: 2025-11-26
