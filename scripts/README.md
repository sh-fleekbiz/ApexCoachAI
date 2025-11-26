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

## Deployment Scripts (Bash - Linux/Mac/WSL)

### deploy-backend.sh

**Deploy backend services to Azure Container Apps**

Performs:

- Builds Docker images for search API and indexer
- Pushes images to Azure Container Registry
- Updates Azure Container Apps
- Verifies deployment health

**Usage**:

```bash
chmod +x scripts/deploy-backend.sh
./scripts/deploy-backend.sh
```

**Prerequisites**:

- Azure CLI authenticated
- Docker installed
- Access to Azure Container Registry

---

### deploy-frontend.sh

**Deploy frontend to Azure Static Web App**

Performs:

- Installs dependencies
- Builds production bundle
- Deploys to Azure Static Web App
- Verifies deployment

**Usage**:

```bash
chmod +x scripts/deploy-frontend.sh
./scripts/deploy-frontend.sh
```

**Prerequisites**:

- Node.js and pnpm installed
- Azure CLI authenticated
- SWA CLI or deployment token

---

### deploy-full.sh

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

```bash
# Linux/Mac/WSL
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

- **Local Development**: `docs/demo-guide.md`
- **Deployment**: `docs/deployment-manual.md`
- **Configuration**: `docs/CONFIG.md`
- **Issues**: `docs/apexcoachai_issues.md`

---

**Maintained by**: ApexCoachAI Team
**Last Updated**: 2025-11-26
