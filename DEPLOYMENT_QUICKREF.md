# ApexCoachAI - Quick Deployment Reference

**Target**: Azure Shared Platform
**Last Updated**: November 26, 2025

---

## 🚀 Quick Start (3 Commands)

```powershell
# 1. Configure environment variables
.\scripts\configure-env-variables.ps1

# 2. Deploy backend
.\scripts\deploy-backend.ps1

# 3. Deploy frontend
.\scripts\deploy-frontend.ps1
```

**Duration**: ~10-15 minutes total

---

## 📋 Prerequisites Checklist

- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Docker installed and running
- [ ] Node.js 20+ and pnpm installed
- [ ] Static Web Apps CLI installed (`npm install -g @azure/static-web-apps-cli`)
- [ ] Access to subscription `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`

---

## 🔑 Required Credentials

Gather before starting:

1. **PostgreSQL Password** (user: `pgadmin`)
   - Portal → `pg-shared-apps-eastus2` → Connection security

2. **Azure OpenAI API Key**
   - Portal → `shared-openai-eastus2` → Keys and Endpoint

3. **Azure AI Search Admin Key**
   - Portal → `shared-search-standard-eastus2` → Keys

4. **Azure Storage Connection String**
   - Portal → `stmahumsharedapps` → Access keys

---

## 📍 Application URLs

After deployment:

- **Frontend**: https://apexcoachai.shtrial.com
- **Backend API**: https://api.apexcoachai.shtrial.com
- **API Docs**: https://api.apexcoachai.shtrial.com/docs

---

## 🎯 Step-by-Step Process

### Step 1: Configure Environment Variables

```powershell
.\scripts\configure-env-variables.ps1
```

**Prompts for**:

- PostgreSQL password
- Azure OpenAI API key
- Azure AI Search admin key
- Azure Storage connection string
- JWT secret (or auto-generate)

**Configures**:

- `apexcoachai-api` Container App (15 variables)
- `apexcoachai-indexer` Container App (15 variables)
- `apexcoachai` Static Web App (4 variables)

**Duration**: 2-3 minutes

---

### Step 2: Deploy Backend

```powershell
.\scripts\deploy-backend.ps1
```

**Actions**:

1. Builds Docker image for API (`apexcoachai-api:latest`)
2. Builds Docker image for Indexer (`apexcoachai-indexer:latest`)
3. Pushes to `acrsharedapps.azurecr.io`
4. Updates Container Apps with new images

**Duration**: 5-10 minutes

---

### Step 3: Deploy Frontend

```powershell
.\scripts\deploy-frontend.ps1
```

**Actions**:

1. Resolves backend API URL from Container Apps
2. Installs frontend dependencies
3. Builds production bundle with correct API URL
4. Deploys to Static Web App

**Duration**: 3-5 minutes

---

### Step 4: Verify (Optional)

```bash
# Run smoke tests
bash .\scripts\smoke-test.sh

# Or use Playwright
pnpm test:e2e --grep smoke
```

---

## 🔍 Quick Verification

### 1. Check Frontend

```powershell
curl https://apexcoachai.shtrial.com
```

Expected: HTTP 200

### 2. Check Backend API

```powershell
curl https://api.apexcoachai.shtrial.com/health
```

Expected: `{"status":"ok"}`

### 3. Check API Docs

Open browser: https://api.apexcoachai.shtrial.com/docs

### 4. Test Chat

- Open https://apexcoachai.shtrial.com
- Try sending a message
- Verify AI response

---

## 🛠️ Troubleshooting Quick Fixes

### Backend Returns 500 Error

```powershell
# Check environment variables
az containerapp show --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --query "properties.template.containers[0].env[].name" -o table

# View logs
az containerapp logs show --name apexcoachai-api `
  --resource-group rg-shared-container-apps --follow
```

### Frontend Can't Connect to Backend

```powershell
# Check CORS settings
az containerapp show --name apexcoachai-api `
  --resource-group rg-shared-container-apps `
  --query "properties.template.containers[0].env[?name=='ALLOWED_ORIGINS'].value" -o tsv

# Should be: https://apexcoachai.shtrial.com
```

### Environment Variables Not Taking Effect

```powershell
# Restart Container App
az containerapp revision restart `
  --name apexcoachai-api `
  --resource-group rg-shared-container-apps
```

---

## 🔄 Update Deployment

### Update Backend Code

```powershell
# Make code changes, then:
.\scripts\deploy-backend.ps1
```

### Update Frontend Code

```powershell
# Make code changes, then:
.\scripts\deploy-frontend.ps1
```

### Update Environment Variables

```powershell
# Update credentials, then:
.\scripts\configure-env-variables.ps1

# Restart apps
az containerapp revision restart --name apexcoachai-api `
  --resource-group rg-shared-container-apps
```

---

## 📚 Full Documentation

For detailed information, see:

- **Complete Guide**: `docs/DEPLOYMENT_GUIDE.md`
- **Configuration**: `docs/CONFIG.md`
- **Manual Steps**: `docs/deployment-manual.md`
- **Known Issues**: `docs/apexcoachai_issues.md`

---

## 🎓 Key Concepts

### Shared Platform Resources

**DO NOT CREATE**:

- New resource groups
- New PostgreSQL servers
- New storage accounts
- New OpenAI/Search services

**DO USE**:

- `pg-shared-apps-eastus2` (PostgreSQL)
- `stmahumsharedapps` (Storage)
- `shared-openai-eastus2` (Azure OpenAI)
- `shared-search-standard-eastus2` (AI Search)
- `acrsharedapps` (Container Registry)

### Resource Ownership

**App-Specific Resources** (ApexCoachAI):

- Database: `apexcoachai` on `pg-shared-apps-eastus2`
- Container: `apexcoachai` in `stmahumsharedapps`
- Index: `idx-apexcoachai-primary` on AI Search
- Container Apps: `apexcoachai-api`, `apexcoachai-indexer`
- Static Web App: `apexcoachai`

---

## 💡 Pro Tips

1. **Configure First**: Always run `configure-env-variables.ps1` before deploying
2. **Backend Before Frontend**: Deploy backend first so frontend gets correct API URL
3. **Check Logs**: Monitor logs during deployment to catch issues early
4. **Tag Releases**: Use git tags for production deployments
5. **Test Locally**: Run `pnpm dev` and `pnpm test` before deploying

---

## 🆘 Getting Help

1. Check `docs/DEPLOYMENT_GUIDE.md` troubleshooting section
2. View Container App logs (see commands above)
3. Check Azure Portal for resource status
4. Review `docs/apexcoachai_issues.md` for known issues

---

**Quick Reference Version**: 1.0.0
**For Full Documentation**: See `docs/DEPLOYMENT_GUIDE.md`
