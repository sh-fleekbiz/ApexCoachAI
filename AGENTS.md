# Agent Profile – ApexCoachAI

**Contract:** MahumTech Shared Azure Platform (`#azure-mcp`)
**App Slug:** `apexcoachai`

You are an AI coding agent working on the **ApexCoachAI** application - AI Coaching Platform.
This project adheres to a strict **Shared Azure Platform Contract**.

---

## 🛑 HARD RULES (Violations will be rejected)

1. **NO NEW RESOURCE GROUPS:** You are strictly **forbidden** from creating new Azure Resource Groups.
2. **NO NEW SERVERS:** Do not create PostgreSQL Servers, Storage Accounts, OpenAI accounts, or AI Search Services.
3. **SHARED ONLY:** You must deploy resources *into* the existing shared infrastructure listed below.
4. **NO `az group create`:** If you generate Bicep/Terraform/CLI that calls `az group create`, **you are wrong**. Fix it.

---

## 🏗️ Infrastructure Architecture

### 1. The Shared Platform (Read-Only)

You will use these existing resources for all deployments:

| Service | Resource Group | Resource Name |
| :--- | :--- | :--- |
| **AI / LLM (OpenAI)** | `rg-shared-ai` | `shared-openai-eastus2` |
| **AI Search** | `rg-shared-ai` | `shared-search-standard-eastus2` |
| **PostgreSQL Host** | `rg-shared-data` | `pg-shared-apps-eastus2` |
| **Blob Storage** | `rg-shared-data` | `stmahumsharedapps` |
| **Container Registry** | `rg-shared-container-apps` | `acrsharedapps` |
| **Container Apps Env (Dev)** | `rg-shared-container-apps` | `cae-shared-apps-dev` |
| **Container Apps Env (Prod)** | `rg-shared-container-apps` | `cae-shared-apps-prod` |
| **Log Analytics** | `rg-shared-logs` | `law-shared-apps-eastus2` |
| **Application Insights** | `rg-shared-logs` | `appi-shared-apps-eastus2` |
| **Static Web Apps** | `rg-shared-web` | (per-app SWAs) |
| **DNS / Certificates** | `rg-shared-dns` | (shared DNS zones) |

### 2. App-Specific Resources (Owned by this Repo)

You are authorized to manage **only** these specific child resources for `apexcoachai`:

| Resource Type | Name | Location |
| :--- | :--- | :--- |
| **Database** | `apexcoachai` | `pg-shared-apps-eastus2` |
| **Blob Container** | `apexcoachai` | `stmahumsharedapps` |
| **Search Index** | `idx-apexcoachai-primary` | `shared-search-standard-eastus2` |
| **Static Web App** | `apexcoachai` | `rg-shared-web` |
| **Container App (API)** | `ca-apexcoachai-api` | `rg-shared-container-apps` |
| **Container Images** | `acrsharedapps.azurecr.io/apexcoachai-api:*` | `acrsharedapps` |

### 3. Resource Groups Reference

| Resource Group | Purpose | Create Resources Here? |
| :--- | :--- | :--- |
| `rg-shared-ai` | Azure OpenAI, AI Search | ❌ No - use existing |
| `rg-shared-data` | PostgreSQL, Storage | ❌ No - use existing |
| `rg-shared-container-apps` | ACR, Container Apps | ✅ Container Apps only |
| `rg-shared-web` | Static Web Apps | ✅ SWAs only |
| `rg-shared-logs` | Monitoring | ❌ No - use existing |
| `rg-shared-dns` | DNS, Certs | ❌ No - use existing |
| `rg-shared-backup` | Backups | ❌ No - use existing |

---

## 💻 Project Overview

**Application**: AI Coaching Platform
**URL**: https://apexcoachai.shtrial.com
**Stack**: Next.js + Fastify + Azure AI Services
**API Base URL**: https://api.apexcoachai.shtrial.com
**Swagger UI**: https://api.apexcoachai.shtrial.com/docs
**OpenAPI JSON**: https://api.apexcoachai.shtrial.com/openapi.json

## URLs for this solution

- Frontend demo:
  - https://apexcoachai.shtrial.com

- Backend API base:
  - https://api.apexcoachai.shtrial.com

- API docs UI:
  - https://api.apexcoachai.shtrial.com/docs

## E2E testing with Playwright

- Use `pnpm` as the package manager.
- Install dependencies and run tests with:

  ```bash
  pnpm install
  pnpm test:e2e
  ```

- `pretest:e2e` runs `pnpm exec playwright install` so browsers are installed before tests run.
- Do not replace or remove the Playwright scripts; extend them if you add more tests.

## Infrastructure and Azure rules

- Do NOT create new Azure resource groups.
- Reuse the shared resource groups (for example: rg-shared-ai, rg-shared-data, rg-shared-apps, rg-shared-web, rg-shared-logs).
- For databases, use the shared Postgres server (e.g. pg-shared-apps-eastus2) and create or use a database named after this app's slug ("apexcoachai").
- For storage, reuse the shared storage account and create/reuse containers named after this app's slug.
- For AI and search, use shared Azure OpenAI and Azure Search endpoints defined in the environment (do not hard-code secrets in source).

---

## 🔧 Build & Test Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
```

---

## 🚀 Deployment Commands

```bash
# Build and push API image
docker build -t acrsharedapps.azurecr.io/apexcoachai-api:latest -f apps/backend/Dockerfile .
az acr login --name acrsharedapps
docker push acrsharedapps.azurecr.io/apexcoachai-api:latest

# Deploy to Container Apps
az containerapp update \
  --name ca-apexcoachai-api \
  --resource-group rg-shared-container-apps \
  --image acrsharedapps.azurecr.io/apexcoachai-api:latest

# Deploy Static Web App (handled by GitHub Actions)
# Push to main branch triggers deployment
```

---

## 📋 Environment Variables

Required environment variables for local development (`.env.local`):

```bash
# Database (Shared PostgreSQL)
DATABASE_URL=postgresql://pgadmin:***@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=***
AZURE_OPENAI_API_VERSION=2025-01-01-preview
AZURE_OPENAI_DEPLOYMENT_CHAT=gpt-4o
AZURE_OPENAI_DEPLOYMENT_EMBEDDING=text-embedding-3-small

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_API_KEY=***
AZURE_SEARCH_INDEX=idx-apexcoachai-primary

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=***
AZURE_STORAGE_CONTAINER=apexcoachai

# Application Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=***
APP_NAME=apexcoachai
```

---

## 🚫 Boundaries

- **Do the hard work**: Search this repo for existing Bicep/ARM/Terraform and reuse patterns.
- **Don't take shortcuts**: No isolated "demo" RGs, single-tenant servers, or one-off configs.
- **Never touch** `.github/workflows` secrets layout without explicit permission.
- **Focus on code**: Write clean, minimal code that fits the shared platform instead of reinventing infra.

If you think a new resource is required, **FIRST** check if the shared platform already provides it.
Extend existing shared resources (new DB, new container, new index), do NOT provision new servers or accounts.
