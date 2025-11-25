# Azure Deployment Guide - Apex Coach AI

This guide provides step-by-step instructions for deploying Apex Coach AI to Azure using the shared infrastructure.

## Deployment Architecture

### Current Setup

- **Frontend**: Azure Static Web App (`apexcoachai` in `rg-shared-web`)
- **Backend API**: Azure Container App (`apexcoachai-api` in `rg-shared-apps`)
- **Indexer**: Azure Container App (`apexcoachai-indexer` in `rg-shared-apps`)
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `apexcoachai_db`)
- **AI Services**: Shared Azure OpenAI (`shared-openai-eastus2` in `rg-shared-ai`)
- **Search**: Shared Azure AI Search (`shared-search-standard-eastus2` in `rg-shared-ai`)
- **Storage**: Shared Azure Blob Storage (`stmahumsharedapps` in `rg-shared-data`)

### Custom Domains

- Frontend: `https://apexcoachai.shtrial.com`
- Backend API: `https://api.apexcoachai.shtrial.com`
- Swagger: `https://api.apexcoachai.shtrial.com/swagger`

## Prerequisites

1. **Azure CLI** installed and logged in:

   ```bash
   az login
   az account set --subscription <subscription-id>
   ```

2. **Azure Developer CLI (azd)** installed:

   ```bash
   # Windows (PowerShell)
   winget install microsoft.azd

   # macOS/Linux
   curl -fsSL https://aka.ms/install-azd.sh | bash
   ```

3. **Docker** installed (for building container images)

4. **Environment Variables** configured (see `.env.local.example`)

5. **GitHub Secrets** configured (for CI/CD):
   - `AZURE_CREDENTIALS` - Service principal JSON
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` - SWA deployment token

## Deployment Methods

### Method 1: Azure Developer CLI (Recommended)

This method uses `azure.yaml` and automatically provisions/updates resources.

#### Initial Setup

```bash
# Initialize azd environment
azd init

# Configure environment
azd env set AZURE_LOCATION eastus2
azd env set AZURE_SUBSCRIPTION_ID <your-subscription-id>
```

#### Deploy All Services

```bash
# Build and deploy everything
azd up

# Or deploy specific services
azd deploy search
azd deploy indexer
azd deploy webapp
```

#### Environment Variables

Configure environment variables via Azure Portal or CLI:

```bash
# Set environment variable for Container App
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --set-env-vars \
    "AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/" \
    "AZURE_OPENAI_KEY=@Microsoft.KeyVault(SecretUri=https://your-kv.vault.azure.net/secrets/openai-key)"
```

### Method 2: Manual Deployment

#### Step 1: Build and Push Container Images

```bash
# Login to Azure Container Registry
az acr login --name shacrapps

# Build and push search API
cd apps/backend/search
docker build -t shacrapps.azurecr.io/apexcoachai-search:latest -f Dockerfile ../..
docker push shacrapps.azurecr.io/apexcoachai-search:latest

# Build and push indexer
cd ../indexer
docker build -t shacrapps.azurecr.io/apexcoachai-indexer:latest -f Dockerfile ../..
docker push shacrapps.azurecr.io/apexcoachai-indexer:latest
```

#### Step 2: Update Container Apps

```bash
# Update search API
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --image shacrapps.azurecr.io/apexcoachai-search:latest

# Update indexer
az containerapp update \
  --name apexcoachai-indexer \
  --resource-group rg-shared-apps \
  --image shacrapps.azurecr.io/apexcoachai-indexer:latest
```

#### Step 3: Deploy Frontend

```bash
# Build frontend
cd apps/frontend
pnpm build

# Deploy to Static Web App
az staticwebapp deploy \
  --name apexcoachai \
  --resource-group rg-shared-web \
  --app-location ./dist
```

### Method 3: GitHub Actions (CI/CD)

The repository includes GitHub Actions workflows for automated deployment.

#### Required GitHub Secrets

1. Go to **Settings → Secrets and variables → Actions**
2. Add the following secrets:
   - `AZURE_CREDENTIALS` - Service principal JSON
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` - From Azure Portal
   - `AZURE_CONTAINER_REGISTRY_USERNAME` - `shacrapps`
   - `AZURE_CONTAINER_REGISTRY_PASSWORD` - From Azure Portal

#### Trigger Deployment

```bash
# Push to main branch triggers automatic deployment
git push origin main

# Or manually trigger from GitHub Actions UI
```

## Database Setup

### Create Database

```bash
# Create database (if not exists)
az postgres flexible-server db create \
  --resource-group rg-shared-data \
  --server-name pg-shared-apps-eastus2 \
  --database-name apexcoachai_db
```

### Run Migrations

```bash
# Run Prisma migrations
cd apps/backend/search
npx prisma migrate deploy

# Or generate client
npx prisma generate
```

### Seed Data (Optional)

```bash
# Run seeding script
npm run seed
```

## Configuration

### Environment Variables

Configure these in Azure Portal or via CLI:

#### Container Apps

```bash
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --set-env-vars \
    "AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/" \
    "AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net" \
    "SHARED_PG_CONNECTION_STRING=<connection-string>"
```

#### Static Web App

```bash
az staticwebapp appsettings set \
  --name apexcoachai \
  --resource-group rg-shared-web \
  --setting-names \
    "VITE_SEARCH_API_URI=https://api.apexcoachai.shtrial.com"
```

### Custom Domain Setup

#### Frontend Custom Domain

1. Go to Azure Portal → Static Web Apps → apexcoachai
2. Click "Custom domains" → "Add"
3. Enter: `apexcoachai.shtrial.com`
4. Add CNAME record in DNS: `apexcoachai.shtrial.com` → `<swa-default-hostname>`
5. Validate and enable HTTPS

#### Backend Custom Domain

1. Go to Azure Portal → Container Apps → apexcoachai-api
2. Click "Custom domains" → "Add custom domain"
3. Enter: `api.apexcoachai.shtrial.com`
4. Add CNAME record in DNS: `api.apexcoachai.shtrial.com` → `<container-app-fqdn>`
5. Upload TLS certificate or use managed certificate

## Monitoring and Troubleshooting

### View Logs

```bash
# Container App logs
az containerapp logs show \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --follow

# Static Web App logs
az staticwebapp logs show \
  --name apexcoachai \
  --resource-group rg-shared-web
```

### Application Insights

1. Navigate to Application Insights in Azure Portal
2. View:
   - Live Metrics
   - Failures
   - Performance
   - Custom queries

### Common Issues

#### Issue: Container App won't start

**Solution**:

1. Check container logs in Azure Portal
2. Verify environment variables are set
3. Ensure image is pushed to registry
4. Check health probe settings

```bash
az containerapp revision list \
  --name apexcoachai-api \
  --resource-group rg-shared-apps
```

#### Issue: Database connection fails

**Solution**:

1. Verify connection string is correct
2. Check PostgreSQL firewall rules
3. Ensure database exists

```bash
az postgres flexible-server firewall-rule list \
  --resource-group rg-shared-data \
  --name pg-shared-apps-eastus2
```

#### Issue: Frontend can't reach backend

**Solution**:

1. Verify CORS settings on Container App
2. Check custom domain configuration
3. Verify environment variable `VITE_SEARCH_API_URI`

## Scaling

### Container Apps Scaling

```bash
# Set min/max replicas
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --min-replicas 0 \
  --max-replicas 10
```

### Static Web App Scaling

Static Web Apps scale automatically with no configuration needed.

## Cost Optimization

Current estimated monthly costs:

- Static Web App (Free tier): $0
- Container Apps (Consumption): ~$5-10
- Shared resources (OpenAI, Search, Storage): Shared across apps

### Tips to Reduce Costs

1. Use consumption plan for Container Apps (scale to zero)
2. Set appropriate min/max replicas
3. Monitor usage and adjust resources
4. Use shared resources when possible

## Security Best Practices

1. **Use Managed Identities** for Azure resource access
2. **Store secrets in Key Vault**, not environment variables
3. **Enable HTTPS** for all endpoints
4. **Configure CORS** appropriately
5. **Use network security groups** to restrict access
6. **Enable Application Insights** for security monitoring
7. **Rotate secrets regularly**

## Rollback

### Rollback Container App

```bash
# List revisions
az containerapp revision list \
  --name apexcoachai-api \
  --resource-group rg-shared-apps

# Activate previous revision
az containerapp revision activate \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --revision <revision-name>
```

### Rollback Static Web App

Static Web Apps maintain deployment history. Rollback via Azure Portal:

1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

## Health Checks

All services expose health endpoints:

- Search API: `https://api.apexcoachai.shtrial.com/health`
- Indexer: `https://apexcoachai-indexer.internal/health`
- Frontend: Monitored by Static Web Apps

## Useful Commands

```bash
# View all Container Apps
az containerapp list --resource-group rg-shared-apps -o table

# View Static Web Apps
az staticwebapp list --resource-group rg-shared-web -o table

# Check deployment status
azd deploy --status

# View environment variables
az containerapp show \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --query "properties.template.containers[0].env"
```

## Additional Resources

- [Azure Container Apps Documentation](https://learn.microsoft.com/azure/container-apps/)
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/azure/static-web-apps/)
- [Azure Developer CLI Documentation](https://learn.microsoft.com/azure/developer/azure-developer-cli/)
- [Project Architecture](./ARCHITECTURE.md)
- [Local Testing Guide](../LOCAL_TESTING_GUIDE.md)
- [Secrets Management](../SECRETS_MANAGEMENT.md)

---

**Last Updated**: 2024-11-24
**Maintained By**: Apex Coach AI Team
