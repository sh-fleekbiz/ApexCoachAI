# ApexCoachAI - Manual Deployment Guide

**Last Updated**: 2025-11-26  
**Target**: Azure Container Apps & Static Web App  
**Deployment Method**: Manual/Script-based (No CI/CD pipelines)

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [Building Container Images](#building-container-images)
5. [Deploying Backend Services](#deploying-backend-services)
6. [Deploying Frontend](#deploying-frontend)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Rollback Procedure](#rollback-procedure)
9. [Troubleshooting](#troubleshooting)

---

## Overview

ApexCoachAI consists of three deployable components:

| Component | Technology | Deployment Target | Image/Build Output |
|-----------|------------|-------------------|-------------------|
| **Search API** | Fastify (Node.js) | Azure Container App `apexcoachai-api` | Docker image |
| **Indexer Service** | Fastify (Node.js) | Azure Container App `apexcoachai-indexer` | Docker image |
| **Frontend** | React (Vite) | Azure Static Web App `apexcoachai` | Static files |

**Architecture**:
```
Internet → Static Web App (Frontend)
              ↓
        Container Apps:
        - apexcoachai-api (port 3000)
        - apexcoachai-indexer (port 3001)
              ↓
        Shared Resources:
        - PostgreSQL (pg-shared-apps-eastus2)
        - Azure OpenAI (shared-openai-eastus2)
        - Azure AI Search (shared-search-standard-eastus2)
        - Azure Storage (stmahumsharedapps)
```

---

## Prerequisites

### Required Tools

Install on your deployment machine:

```bash
# Azure CLI (required)
az --version  # Should be >= 2.50.0
# Install: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Docker (for building images)
docker --version  # Should be >= 20.10
# Install: https://docs.docker.com/get-docker/

# Node.js & pnpm (for frontend build)
node --version   # Should be >= 20.0
pnpm --version   # Should be >= 9.0
# Install pnpm: npm install -g pnpm@9.0.0
```

### Azure Access

Ensure you have:

1. **Azure CLI authenticated**:
   ```bash
   az login
   az account set --subscription 44e77ffe-2c39-4726-b6f0-2c733c7ffe78
   ```

2. **Required RBAC roles**:
   - `Contributor` on `rg-shared-container-apps` (for Container Apps)
   - `Contributor` on `rg-shared-web` (for Static Web App)
   - `AcrPush` on `shacrapps.azurecr.io` (for pushing images)

3. **Access to Azure Container Registry**:
   ```bash
   az acr login --name shacrapps
   ```

---

## Pre-Deployment Checklist

Before starting deployment:

- [ ] **Code is tested locally** - `pnpm dev` works without errors
- [ ] **All tests pass** - `pnpm test` and `pnpm test:e2e` pass
- [ ] **Environment variables configured** - see [Environment Configuration](#environment-configuration)
- [ ] **Database migrations applied** - schema is up to date in production database
- [ ] **Backup completed** (if updating existing deployment)
- [ ] **Change window scheduled** (if production deployment)
- [ ] **Team notified** of deployment

---

## Environment Configuration

### Backend Services Environment Variables

Set these in Azure Container Apps Application Settings:

#### Search API (`apexcoachai-api`)

```bash
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<from_key_vault_or_portal>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Database
DATABASE_URL=postgresql://pgadmin:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_API_KEY=<from_portal>
AZURE_SEARCH_INDEX_NAME=idx-apexcoachai-primary

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<from_portal>
AZURE_STORAGE_CONTAINER=apexcoachai

# Application
NODE_ENV=production
PORT=3000
JWT_SECRET=<strong_random_secret>
```

#### Indexer Service (`apexcoachai-indexer`)

```bash
# Azure OpenAI (same as API)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<same_as_api>
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Azure AI Search (same as API)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_API_KEY=<same_as_api>
AZURE_SEARCH_INDEX_NAME=idx-apexcoachai-primary

# Azure Storage (same as API)
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<same_as_api>
AZURE_STORAGE_CONTAINER=apexcoachai

# Application
NODE_ENV=production
PORT=3001
```

### Frontend Environment Variables

Static Web Apps can inject environment variables at build time or as configuration:

```bash
VITE_SEARCH_API_URI=https://api.apexcoachai.shtrial.com
```

**Note**: Frontend production URL is also hardcoded in `vite.config.ts` as fallback.

---

## Building Container Images

### Step 1: Navigate to Repository Root

```bash
cd /path/to/ApexCoachAI
```

### Step 2: Build Search API Image

```bash
# Build the image
docker build \
  --file apps/backend/search/Dockerfile \
  --tag shacrapps.azurecr.io/apexcoachai-api:latest \
  --tag shacrapps.azurecr.io/apexcoachai-api:$(date +%Y%m%d-%H%M%S) \
  .

# Verify image
docker images | grep apexcoachai-api
```

**Expected output**: Two tags (`:latest` and timestamped)

### Step 3: Build Indexer Service Image

```bash
# Build the image
docker build \
  --file apps/backend/indexer/Dockerfile \
  --tag shacrapps.azurecr.io/apexcoachai-indexer:latest \
  --tag shacrapps.azurecr.io/apexcoachai-indexer:$(date +%Y%m%d-%H%M%S) \
  .

# Verify image
docker images | grep apexcoachai-indexer
```

### Step 4: Test Images Locally (Optional but Recommended)

```bash
# Test search API
docker run --rm -p 3000:3000 \
  -e DATABASE_URL="<your_db_url>" \
  -e AZURE_OPENAI_API_KEY="<your_key>" \
  -e AZURE_SEARCH_API_KEY="<your_key>" \
  -e AZURE_STORAGE_CONNECTION_STRING="<your_conn_string>" \
  -e JWT_SECRET="test_secret" \
  shacrapps.azurecr.io/apexcoachai-api:latest

# In another terminal, test endpoint
curl http://localhost:3000/health
# Expected: 200 OK response

# Stop with Ctrl+C
```

### Step 5: Push Images to Azure Container Registry

```bash
# Login to ACR
az acr login --name shacrapps

# Push search API
docker push shacrapps.azurecr.io/apexcoachai-api:latest
docker push shacrapps.azurecr.io/apexcoachai-api:<timestamp>

# Push indexer
docker push shacrapps.azurecr.io/apexcoachai-indexer:latest
docker push shacrapps.azurecr.io/apexcoachai-indexer:<timestamp>

# Verify images in registry
az acr repository show-tags \
  --name shacrapps \
  --repository apexcoachai-api \
  --orderby time_desc \
  --top 5
```

---

## Deploying Backend Services

### Option A: Deploy via Azure Portal

1. **Navigate to Container App**:
   - Go to Azure Portal → Resource Groups → `rg-shared-container-apps`
   - Click on `apexcoachai-api`

2. **Update Container Image**:
   - Click "Containers" in left sidebar
   - Edit the container
   - Update image to: `shacrapps.azurecr.io/apexcoachai-api:latest`
   - Click "Save"

3. **Trigger New Revision**:
   - Click "Revision Management"
   - Click "Create new revision"
   - Review settings
   - Click "Create"

4. **Monitor Deployment**:
   - Watch "Log stream" for startup logs
   - Check health: Visit `https://api.apexcoachai.shtrial.com/health`

5. **Repeat for Indexer**:
   - Navigate to `apexcoachai-indexer`
   - Follow same steps

### Option B: Deploy via Azure CLI

```bash
# Deploy Search API
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --image shacrapps.azurecr.io/apexcoachai-api:latest

# Deploy Indexer
az containerapp update \
  --name apexcoachai-indexer \
  --resource-group rg-shared-container-apps \
  --image shacrapps.azurecr.io/apexcoachai-indexer:latest

# Monitor deployment
az containerapp revision list \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --output table
```

### Option C: Deploy via Script (Recommended)

Create a deployment script `scripts/deploy-backend.sh`:

```bash
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ACR_NAME="shacrapps"
RESOURCE_GROUP="rg-shared-container-apps"

echo "=== ApexCoachAI Backend Deployment ==="
echo "Timestamp: $TIMESTAMP"

# Login to Azure and ACR
echo "Logging in to Azure..."
az acr login --name $ACR_NAME

# Build and push search API
echo "Building search API..."
docker build \
  --file apps/backend/search/Dockerfile \
  --tag $ACR_NAME.azurecr.io/apexcoachai-api:latest \
  --tag $ACR_NAME.azurecr.io/apexcoachai-api:$TIMESTAMP \
  .

echo "Pushing search API..."
docker push $ACR_NAME.azurecr.io/apexcoachai-api:latest
docker push $ACR_NAME.azurecr.io/apexcoachai-api:$TIMESTAMP

# Build and push indexer
echo "Building indexer..."
docker build \
  --file apps/backend/indexer/Dockerfile \
  --tag $ACR_NAME.azurecr.io/apexcoachai-indexer:latest \
  --tag $ACR_NAME.azurecr.io/apexcoachai-indexer:$TIMESTAMP \
  .

echo "Pushing indexer..."
docker push $ACR_NAME.azurecr.io/apexcoachai-indexer:latest
docker push $ACR_NAME.azurecr.io/apexcoachai-indexer:$TIMESTAMP

# Update Container Apps
echo "Updating search API container app..."
az containerapp update \
  --name apexcoachai-api \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/apexcoachai-api:latest

echo "Updating indexer container app..."
az containerapp update \
  --name apexcoachai-indexer \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/apexcoachai-indexer:latest

echo "=== Deployment Complete ==="
echo "Search API: https://api.apexcoachai.shtrial.com"
echo "Indexer: Internal service"
echo "Image tags: $TIMESTAMP"
```

Make it executable and run:

```bash
chmod +x scripts/deploy-backend.sh
./scripts/deploy-backend.sh
```

---

## Deploying Frontend

### Step 1: Build Frontend

```bash
cd apps/frontend

# Install dependencies (if not already)
pnpm install

# Build production bundle
pnpm build

# Verify build output
ls -lh dist/
# Should see: index.html, assets/, etc.

cd ../..
```

### Step 2: Deploy to Azure Static Web App

#### Option A: Via Azure CLI

```bash
# Install Static Web Apps CLI extension (if not installed)
az extension add --name staticwebapp

# Deploy
az staticwebapp deploy \
  --name apexcoachai \
  --resource-group rg-shared-web \
  --source apps/frontend/dist \
  --no-wait
```

#### Option B: Via Azure Portal

1. **Navigate to Static Web App**:
   - Go to Azure Portal → Resource Groups → `rg-shared-web`
   - Click on `apexcoachai`

2. **Upload via Portal**:
   - Note: Azure Static Web Apps typically use GitHub Actions
   - Manual upload requires SWA CLI or direct deployment token

3. **Using SWA CLI**:
   ```bash
   # Install SWA CLI
   npm install -g @azure/static-web-apps-cli

   # Get deployment token from Azure Portal
   # (Static Web App → Manage deployment token)

   # Deploy
   cd apps/frontend
   swa deploy ./dist \
     --deployment-token "<your_deployment_token>" \
     --app-name apexcoachai
   ```

#### Option C: Upload to Storage (Alternative)

If Static Web App is unavailable, you can serve from Azure Storage:

```bash
# Enable static website hosting on storage account
az storage blob service-properties update \
  --account-name stmahumsharedapps \
  --static-website \
  --index-document index.html \
  --404-document index.html

# Upload files
az storage blob upload-batch \
  --account-name stmahumsharedapps \
  --source apps/frontend/dist \
  --destination '$web' \
  --overwrite
```

### Step 3: Verify Frontend Deployment

```bash
# Test homepage
curl -I https://apexcoachai.shtrial.com

# Expected: HTTP 200 OK

# Open in browser
open https://apexcoachai.shtrial.com
# or
start https://apexcoachai.shtrial.com
```

---

## Post-Deployment Verification

### Health Check Checklist

```bash
# 1. Backend API health
curl https://api.apexcoachai.shtrial.com/health
# Expected: {"status":"ok"} or similar

# 2. API documentation
open https://api.apexcoachai.shtrial.com/docs

# 3. Frontend loads
curl -I https://apexcoachai.shtrial.com
# Expected: 200 OK

# 4. Test signup flow (via browser)
# - Navigate to https://apexcoachai.shtrial.com/#/signup
# - Create test account
# - Verify email/password validation works

# 5. Test chat flow
# - Log in with test account
# - Send a test message
# - Verify AI responds with citations

# 6. Check logs
az containerapp logs show \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --follow \
  --tail 50
```

### Smoke Tests

Create a smoke test script `scripts/smoke-test.sh`:

```bash
#!/bin/bash
set -e

API_URL="https://api.apexcoachai.shtrial.com"
FRONTEND_URL="https://apexcoachai.shtrial.com"

echo "=== Smoke Tests ==="

# Test API health
echo "Testing API health..."
HEALTH=$(curl -s "$API_URL/health")
if [[ $HEALTH == *"ok"* ]]; then
  echo "✓ API health check passed"
else
  echo "✗ API health check failed"
  exit 1
fi

# Test frontend
echo "Testing frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [[ $FRONTEND_STATUS == "200" ]]; then
  echo "✓ Frontend loads successfully"
else
  echo "✗ Frontend failed with status: $FRONTEND_STATUS"
  exit 1
fi

# Test API endpoints (requires auth)
echo "Testing public API endpoints..."
# Add more endpoint tests here

echo "=== All smoke tests passed ==="
```

---

## Rollback Procedure

If deployment fails or issues are detected:

### Rollback Backend Services

```bash
# List recent revisions
az containerapp revision list \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --output table

# Activate previous revision
az containerapp revision activate \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --revision <previous_revision_name>

# Verify
curl https://api.apexcoachai.shtrial.com/health
```

### Rollback Frontend

```bash
# Redeploy previous build from local backup or git
git checkout <previous_commit>
cd apps/frontend
pnpm build
# Deploy using same method as above
```

### Rollback Database Migrations (Caution!)

```bash
# Connect to database
psql "postgresql://pgadmin:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require"

# Check migration history
SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;

# Rollback is manual - restore from backup if critical
# Contact DBA for assistance
```

---

## Troubleshooting

### Issue: Container App fails to start

**Check logs**:
```bash
az containerapp logs show \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --follow
```

**Common causes**:
- Missing environment variables
- Database connection failure
- Port conflict
- Out of memory

### Issue: Image pull fails

**Symptoms**: `ImagePullBackOff` or `ErrImagePull`

**Solutions**:
1. Verify ACR access:
   ```bash
   az acr repository show \
     --name shacrapps \
     --repository apexcoachai-api
   ```

2. Check Container App has ACR pull permissions
3. Verify image tag exists

### Issue: Frontend shows old version

**Solutions**:
1. Clear CDN cache (if using CDN)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check deployment logs
4. Verify files were uploaded:
   ```bash
   az staticwebapp show \
     --name apexcoachai \
     --resource-group rg-shared-web
   ```

### Issue: Database connection fails in production

**Check**:
1. Firewall rules allow Container Apps subnet
2. Connection string is correct
3. Database server is running
4. Credentials are valid

```bash
# Test from Container App
az containerapp exec \
  --name apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --command "/bin/sh"

# Inside container:
nc -zv pg-shared-apps-eastus2.postgres.database.azure.com 5432
```

---

## Deployment Tracking

Keep a deployment log:

| Date | Version/Tag | Deployer | Services Updated | Issues | Rollback Required |
|------|-------------|----------|------------------|--------|-------------------|
| 2025-11-26 | 20251126-143022 | username | api, indexer, frontend | None | No |

---

## Best Practices

1. **Always tag images with timestamps** in addition to `:latest`
2. **Test locally before deploying** - run Docker images locally
3. **Deploy during low-traffic windows** - minimize user impact
4. **Monitor for 10-15 minutes post-deployment** - check logs and metrics
5. **Keep deployment scripts in version control**
6. **Document all environment variable changes**
7. **Backup database before schema changes**
8. **Use blue-green deployment** for zero-downtime (future enhancement)

---

## Next Steps

After successful deployment:

1. **Monitor Application Insights** for errors and performance
2. **Set up alerts** for critical failures
3. **Schedule regular deployments** (e.g., weekly releases)
4. **Automate with scripts** - reduce manual steps
5. **Consider CI/CD pipeline** - GitHub Actions for automated deployments (future)

---

**Questions or Issues?**
- Check Container Apps logs in Azure Portal
- Review `docs/apexcoachai_issues.md` for known issues
- Contact team lead or DevOps support
