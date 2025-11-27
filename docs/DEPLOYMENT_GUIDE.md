# ApexCoachAI Deployment Guide

**Last Updated**: November 26, 2025
**Target Environment**: Azure Shared Platform

This guide provides step-by-step instructions for deploying the ApexCoachAI application with proper environment variable configuration for both frontend and backend services.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variable Configuration](#environment-variable-configuration)
3. [Deployment Options](#deployment-options)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Tools

- **Azure CLI**: Version 2.50.0 or higher
  ```powershell
  az --version
  ```
- **Docker**: For building container images
  ```powershell
  docker --version
  ```
- **Node.js**: Version 20 or higher
  ```powershell
  node --version
  ```
- **pnpm**: Version 8 or higher
  ```powershell
  pnpm --version
  ```
- **Static Web Apps CLI**: For frontend deployment
  ```powershell
  npm install -g @azure/static-web-apps-cli
  ```

### Azure Access

You need the following access levels:

- **Resource Groups**: `rg-shared-container-apps`, `rg-shared-web`
- **Permissions**: Contributor role on above resource groups
- **Subscription**: `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`

Verify access:

```powershell
az account show
az account set --subscription 44e77ffe-2c39-4726-b6f0-2c733c7ffe78
```

### Required Credentials

Before deployment, gather the following credentials from Azure Portal:

1. **PostgreSQL Password**
   - Navigate to: Azure Portal → `pg-shared-apps-eastus2` → Settings → Connection security
   - User: `pgadmin`

2. **Azure OpenAI API Key**
   - Navigate to: Azure Portal → `shared-openai-eastus2` → Keys and Endpoint
   - Copy either Key 1 or Key 2

3. **Azure AI Search Admin Key**
   - Navigate to: Azure Portal → `shared-search-standard-eastus2` → Keys
   - Copy Primary admin key

4. **Azure Storage Connection String**
   - Navigate to: Azure Portal → `stmahumsharedapps` → Access keys
   - Copy Connection string

---

## Environment Variable Configuration

### Backend Environment Variables

The backend services (API and Indexer) require the following environment variables:

| Variable                            | Required | Description                                         | Example                                                                                                             |
| ----------------------------------- | -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                      | Yes      | PostgreSQL connection string                        | `postgresql://pgadmin:PASSWORD@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require` |
| `DIRECT_URL`                        | Yes      | Direct PostgreSQL connection (same as DATABASE_URL) | Same as DATABASE_URL                                                                                                |
| `AZURE_OPENAI_ENDPOINT`             | Yes      | Azure OpenAI endpoint                               | `https://shared-openai-eastus2.openai.azure.com/`                                                                   |
| `AZURE_OPENAI_API_KEY`              | Yes      | Azure OpenAI API key                                | `abc123...`                                                                                                         |
| `AZURE_OPENAI_API_VERSION`          | Yes      | API version                                         | `2025-01-01-preview`                                                                                                |
| `AZURE_OPENAI_CHAT_DEPLOYMENT`      | Yes      | Chat model deployment name                          | `gpt-4o`                                                                                                            |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` | Yes      | Embedding model deployment                          | `text-embedding-3-small`                                                                                            |
| `AZURE_STORAGE_CONNECTION_STRING`   | Yes      | Storage account connection string                   | `DefaultEndpointsProtocol=https;...`                                                                                |
| `AZURE_STORAGE_ACCOUNT_NAME`        | Yes      | Storage account name                                | `stmahumsharedapps`                                                                                                 |
| `AZURE_STORAGE_CONTAINER`           | Yes      | Blob container name                                 | `apexcoachai`                                                                                                       |
| `JWT_SECRET`                        | Yes      | Secret for JWT signing (min 32 chars)               | Generated or provided                                                                                               |
| `NODE_ENV`                          | Yes      | Environment mode                                    | `production`                                                                                                        |
| `PORT`                              | Yes      | Server port (3000 for API, 3001 for Indexer)        | `3000`                                                                                                              |
| `LOG_LEVEL`                         | No       | Logging level                                       | `info`                                                                                                              |
| `ALLOWED_ORIGINS`                   | No       | CORS allowed origins                                | `https://apexcoachai.shtrial.com`                                                                                   |

### Frontend Environment Variables

The frontend (Static Web App) requires:

| Variable               | Required | Description                 | Example                               |
| ---------------------- | -------- | --------------------------- | ------------------------------------- |
| `VITE_SEARCH_API_URI`  | Yes      | Backend API base URL        | `https://api.apexcoachai.shtrial.com` |
| `BACKEND_URI`          | Yes      | Same as VITE_SEARCH_API_URI | `https://api.apexcoachai.shtrial.com` |
| `NEXT_PUBLIC_API_URL`  | Yes      | Public API URL              | `https://api.apexcoachai.shtrial.com` |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Frontend site URL           | `https://apexcoachai.shtrial.com`     |

---

## Deployment Options

### Option 1: Automated Configuration + Deployment (Recommended)

This option uses the provided scripts to configure environment variables and deploy all services.

```powershell
# Step 1: Configure environment variables
.\scripts\configure-env-variables.ps1

# Step 2: Deploy backend services
.\scripts\deploy-backend.ps1

# Step 3: Deploy frontend
.\scripts\deploy-frontend.ps1

# Step 4: Verify deployment
.\scripts\smoke-test.sh
```

### Option 2: Manual Configuration + Automated Deployment

Configure environment variables manually, then use deployment scripts.

```powershell
# Configure backend API manually
az containerapp update --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --set-env-vars `
    "DATABASE_URL=postgresql://pgadmin:PASSWORD@..." `
    "AZURE_OPENAI_API_KEY=..." `
    # ... (see full list above)

# Configure frontend manually
az staticwebapp appsettings set --name apexcoachai `
  --resource-group rg-shared-web `
  --setting-names `
    "VITE_SEARCH_API_URI=https://api.apexcoachai.shtrial.com" `
    "NEXT_PUBLIC_SITE_URL=https://apexcoachai.shtrial.com"

# Then deploy
.\scripts\deploy-backend.ps1
.\scripts\deploy-frontend.ps1
```

### Option 3: Use Local .env Files

If you have local `.env` files with credentials:

```powershell
# Configure using local env files
.\scripts\configure-env-variables.ps1 -UseLocalEnvFiles

# Then deploy
.\scripts\deploy-backend.ps1
.\scripts\deploy-frontend.ps1
```

---

## Step-by-Step Deployment

### Step 1: Configure Environment Variables

Run the configuration script:

```powershell
# From repository root
cd h:\Repos\sh-fleekbiz\ApexCoachAI

# Run configuration script
.\scripts\configure-env-variables.ps1
```

When prompted, provide:

1. PostgreSQL password
2. Azure OpenAI API key
3. Azure AI Search admin key
4. Azure Storage connection string
5. JWT secret (or press Enter to auto-generate)

**Expected Output:**

```
=== ApexCoachAI Environment Configuration ===
Checking Azure CLI login...
Setting subscription to 44e77ffe-2c39-4726-b6f0-2c733c7ffe78
Using predefined Azure configuration values

Please provide the following Azure credentials:
(Press Enter to skip if already configured)
PostgreSQL Password (pgadmin@pg-shared-apps-eastus2): ********
Azure OpenAI API Key: ********
...

Configuring Container App: apexcoachai-api
Setting 15 environment variables...
✓ Successfully configured apexcoachai-api

Configuring Container App: apexcoachai-indexer
Setting 15 environment variables...
✓ Successfully configured apexcoachai-indexer

Configuring Static Web App: apexcoachai
Setting 4 application settings...
✓ Successfully configured apexcoachai

=== Configuration Complete ===
```

### Step 2: Deploy Backend Services

Build and deploy the backend API and indexer services:

```powershell
# Run backend deployment script
.\scripts\deploy-backend.ps1
```

This script will:

1. Build Docker images for API and Indexer
2. Push images to Azure Container Registry (`acrsharedapps`)
3. Update Container Apps with new images

**Expected Output:**

```
=== ApexCoachAI Backend Deployment (PowerShell) ===
Checking Azure CLI login...
Using ACR: acrsharedapps.azurecr.io
Using Resource Group: rg-shared-container-apps
Logging in to Azure Container Registry...

Building search API image...
[+] Building 45.2s (16/16) FINISHED
...

Pushing search API image...
The push refers to repository [acrsharedapps.azurecr.io/apexcoachai-api]
...

Building indexer image...
[+] Building 38.5s (14/14) FINISHED
...

Updating Container App 'apexcoachai-api' image...
✓ Successfully updated apexcoachai-api

Updating Container App 'apexcoachai-indexer' image...
✓ Successfully updated apexcoachai-indexer

=== Backend deployment script completed ===
```

**Duration**: Approximately 5-10 minutes

### Step 3: Deploy Frontend

Build and deploy the frontend to Azure Static Web Apps:

```powershell
# Run frontend deployment script
.\scripts\deploy-frontend.ps1
```

This script will:

1. Resolve backend API FQDN from Container Apps
2. Build frontend with correct API URL
3. Deploy to Static Web App

**Expected Output:**

```
=== ApexCoachAI Frontend Deployment (PowerShell) ===
Checking Azure CLI login...
Resolving backend API FQDN from Container App 'apexcoachai-api'...
Using BACKEND_URI=https://apexcoachai-api.redmushroom-a1b2c3d4.eastus2.azurecontainerapps.io

Installing frontend dependencies...
Progress: resolved 245, reused 245, downloaded 0, added 245, done

Building production bundle...
vite v5.0.0 building for production...
✓ 1234 modules transformed.
dist/index.html                    5.67 kB │ gzip: 2.34 kB
dist/assets/index-abc123def.js   234.56 kB │ gzip: 78.90 kB
✓ built in 12.34s

Deploying to Azure Static Web App 'apexcoachai' using SWA CLI...
Deploying front-end...
✓ Deployed successfully

=== Frontend deployment script completed ===
Frontend URL: https://apexcoachai.shtrial.com
```

**Duration**: Approximately 3-5 minutes

### Step 4: Verify Deployment

Run smoke tests to verify all services are working:

```powershell
# Run smoke tests (bash script - requires Git Bash or WSL)
bash .\scripts\smoke-test.sh

# Or use Playwright tests
pnpm test:e2e --grep smoke
```

**Expected Output:**

```
=== ApexCoachAI Smoke Test ===
Testing Frontend: https://apexcoachai.shtrial.com
✓ Frontend is accessible (HTTP 200)

Testing Backend API: https://api.apexcoachai.shtrial.com
✓ API health check passed
✓ API docs accessible at /docs

Testing Database Connection:
✓ Database connection successful

=== All Smoke Tests Passed ===
```

---

## Verification

### Manual Verification Steps

1. **Frontend Accessibility**

   ```powershell
   curl https://apexcoachai.shtrial.com
   ```

   Expected: HTTP 200 with HTML content

2. **Backend API Health**

   ```powershell
   curl https://api.apexcoachai.shtrial.com/health
   ```

   Expected: `{"status":"ok"}`

3. **API Documentation**
   - Open browser: https://api.apexcoachai.shtrial.com/docs
   - Expected: Swagger UI with API documentation

4. **Frontend-Backend Communication**
   - Open: https://apexcoachai.shtrial.com
   - Try chat functionality
   - Expected: AI responses from backend

### Check Environment Variables

**Backend (Container Apps):**

```powershell
# List all environment variables for API
az containerapp show `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --query "properties.template.containers[0].env[].name" -o table

# Check specific variable (without exposing value)
az containerapp show `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --query "properties.template.containers[0].env[?name=='AZURE_OPENAI_ENDPOINT'].value" -o tsv
```

**Frontend (Static Web App):**

```powershell
# List all app settings
az staticwebapp appsettings list `
  --name apexcoachai `
  --resource-group rg-shared-web `
  --query "properties" -o json
```

### Check Logs

**Backend Logs:**

```powershell
# View API logs
az containerapp logs show `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --follow

# View indexer logs
az containerapp logs show `
  --name apexcoachai-indexer `
  --resource-group rg-shared-container-apps `
  --follow
```

**Frontend Logs:**

- Navigate to Azure Portal → Static Web Apps → `apexcoachai` → Functions → Monitor

---

## Troubleshooting

### Issue: Backend API Returns 500 Error

**Symptoms:**

- Frontend shows "Failed to fetch" errors
- API health check fails
- Container app shows errors in logs

**Solutions:**

1. **Check Environment Variables**

   ```powershell
   # Verify all required variables are set
   az containerapp show --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --query "properties.template.containers[0].env[].name" -o table
   ```

   Missing variables? Re-run configuration:

   ```powershell
   .\scripts\configure-env-variables.ps1
   ```

2. **Check Database Connection**

   ```powershell
   # Test database connectivity from local machine
   $dbUrl = "postgresql://pgadmin:PASSWORD@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require"
   docker run --rm postgres:15 psql "$dbUrl" -c "SELECT version();"
   ```

   If fails, check:
   - Password is correct
   - Database `apexcoachai` exists
   - Firewall allows Container Apps subnet

3. **Check Azure OpenAI Connection**

   ```powershell
   # Test OpenAI endpoint
   $endpoint = "https://shared-openai-eastus2.openai.azure.com/"
   $apiKey = "YOUR_KEY"
   curl "$endpoint/openai/deployments?api-version=2025-01-01-preview" `
     -H "api-key: $apiKey"
   ```

4. **View Container Logs**
   ```powershell
   az containerapp logs show `
     --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --follow
   ```

### Issue: Frontend Can't Connect to Backend

**Symptoms:**

- Chat functionality shows errors
- Network requests fail with CORS errors
- Console shows "blocked by CORS policy"

**Solutions:**

1. **Check ALLOWED_ORIGINS**

   ```powershell
   # Verify CORS settings
   az containerapp show --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --query "properties.template.containers[0].env[?name=='ALLOWED_ORIGINS'].value" -o tsv
   ```

   Should include: `https://apexcoachai.shtrial.com`

   Fix:

   ```powershell
   az containerapp update --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --set-env-vars "ALLOWED_ORIGINS=https://apexcoachai.shtrial.com"
   ```

2. **Verify Frontend API URL**

   ```powershell
   # Check Static Web App settings
   az staticwebapp appsettings list `
     --name apexcoachai `
     --resource-group rg-shared-web `
     --query "properties.VITE_SEARCH_API_URI"
   ```

   Should match Container App URL.

   Fix and redeploy:

   ```powershell
   .\scripts\configure-env-variables.ps1
   .\scripts\deploy-frontend.ps1
   ```

3. **Check Backend Ingress**

   ```powershell
   # Verify ingress is enabled and public
   az containerapp show --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --query "properties.configuration.ingress.{external:external,fqdn:fqdn}" -o table
   ```

   `external` should be `true`.

### Issue: Deployment Script Fails

**Symptoms:**

- Docker build fails
- Image push fails
- Container app update fails

**Solutions:**

1. **Docker Build Fails**
   - Check Docker is running: `docker ps`
   - Check Dockerfile exists: `ls apps/backend/search/Dockerfile`
   - Try building locally: `docker build -f apps/backend/search/Dockerfile .`

2. **Image Push Fails**
   - Re-login to ACR: `az acr login --name acrsharedapps`
   - Check ACR exists: `az acr show --name acrsharedapps`

3. **Container App Update Fails**
   - Verify app exists:
     ```powershell
     az containerapp show --name apexcoachai-api `
       --resource-group rg-shared-container-apps
     ```
   - If doesn't exist, create it first (see `docs/deployment-manual.md`)

### Issue: Environment Variables Not Persisting

**Symptoms:**

- Variables set but app still shows errors
- Changes don't take effect after restart

**Solutions:**

1. **Restart Container App**

   ```powershell
   # Restart to pick up new environment variables
   az containerapp revision restart `
     --name apexcoachai-api `
     --resource-group rg-shared-container-apps
   ```

2. **Check Revision Status**

   ```powershell
   # List revisions
   az containerapp revision list `
     --name apexcoachai-api `
     --resource-group rg-shared-container-apps `
     --query "[].{name:name,active:properties.active,createdTime:properties.createdTime}" -o table
   ```

3. **Force New Revision**
   ```powershell
   # Redeploy to create new revision
   .\scripts\deploy-backend.ps1
   ```

---

## Rollback Procedures

### Rollback Backend Services

If the new backend deployment has issues, rollback to previous revision:

```powershell
# List revisions
az containerapp revision list `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --query "[].{name:name,active:properties.active,createdTime:properties.createdTime}" -o table

# Activate previous revision (replace with actual revision name)
az containerapp revision activate `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --revision apexcoachai-api--abc123xyz

# Deactivate current (broken) revision
az containerapp revision deactivate `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --revision apexcoachai-api--def456uvw
```

### Rollback Frontend

Static Web Apps doesn't support instant rollback. To rollback:

1. **Checkout previous Git commit**

   ```powershell
   git log --oneline -n 5
   git checkout <previous-commit-hash>
   ```

2. **Redeploy**

   ```powershell
   .\scripts\deploy-frontend.ps1
   ```

3. **Return to latest**
   ```powershell
   git checkout main
   ```

### Rollback Environment Variables

If environment variable changes caused issues:

```powershell
# Re-run configuration with previous values
.\scripts\configure-env-variables.ps1

# Or set specific variables manually
az containerapp update --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --set-env-vars "DATABASE_URL=<previous-value>"
```

---

## Best Practices

### Security

1. **Never commit secrets to Git**
   - Use `.env` files (gitignored)
   - Use Azure App Settings for production

2. **Rotate credentials regularly**
   - Database passwords: Every 90 days
   - API keys: Every 90 days
   - JWT secrets: When compromised

3. **Use strong JWT secrets**
   - Minimum 32 characters
   - Use cryptographically secure random generation

### Deployment

1. **Test locally before deploying**

   ```powershell
   pnpm dev
   pnpm test
   pnpm lint
   ```

2. **Deploy backend before frontend**
   - Ensures API is ready when frontend deploys

3. **Monitor logs during deployment**

   ```powershell
   az containerapp logs show --name apexcoachai-api `
     --resource-group rg-shared-container-apps --follow
   ```

4. **Run smoke tests after deployment**
   ```powershell
   bash .\scripts\smoke-test.sh
   ```

### Maintenance

1. **Keep documentation updated**
   - Update this guide when configuration changes
   - Document any manual steps taken

2. **Tag deployments**

   ```powershell
   git tag -a v1.0.0 -m "Production deployment v1.0.0"
   git push origin v1.0.0
   ```

3. **Monitor application health**
   - Set up Azure Monitor alerts
   - Review logs regularly
   - Track error rates

---

## Additional Resources

- **Infrastructure Details**: See `AGENTS.md`
- **Manual Deployment Steps**: See `docs/deployment-manual.md`
- **Configuration Reference**: See `docs/CONFIG.md`
- **Local Development**: See `docs/demo-guide.md`
- **Known Issues**: See `docs/apexcoachai_issues.md`

---

**Document Version**: 1.0.0
**Last Updated**: November 26, 2025
**Maintained By**: ApexCoachAI Team
