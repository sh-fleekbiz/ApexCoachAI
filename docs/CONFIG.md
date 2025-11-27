# ApexCoachAI - Configuration Reference

**Last Updated**: 2025-11-26
**Version**: 1.0.0

This document provides a comprehensive reference for all environment variables and configuration options used across the ApexCoachAI application.

## Table of Contents

1. [Overview](#overview)
2. [Environment Files](#environment-files)
3. [Backend Search API Configuration](#backend-search-api-configuration)
4. [Backend Indexer Configuration](#backend-indexer-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Shared Azure Resources](#shared-azure-resources)
7. [Security Best Practices](#security-best-practices)
8. [Environment-Specific Settings](#environment-specific-settings)

---

## Overview

ApexCoachAI uses environment variables for configuration across all services. Variables are loaded from `.env` files in development and from Application Settings in production (Azure).

### Configuration Hierarchy

1. **Local Development**: `.env` files in each service directory
2. **Docker**: Environment variables passed to containers
3. **Azure Container Apps**: Application Settings in Azure Portal
4. **Azure Static Web App**: Build configuration and app settings

---

## Environment Files

### File Structure

```
ApexCoachAI/
├── .env                              # Root shared variables
├── .env.example                      # Template with placeholders
├── apps/
│   ├── frontend/
│   │   ├── .env                      # Frontend-specific (gitignored)
│   │   └── .env.example              # Frontend template
│   └── backend/
│       ├── search/
│       │   ├── .env                  # Search API vars (gitignored)
│       │   └── .env.example          # Search template
│       └── indexer/
│           ├── .env                  # Indexer vars (gitignored)
│           └── .env.example          # Indexer template
```

### Creating Your .env Files

```bash
# From repository root
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/search/.env.example apps/backend/search/.env
cp apps/backend/indexer/.env.example apps/backend/indexer/.env
```

---

## Backend Search API Configuration

**Service**: `apps/backend/search`
**Port**: 3000
**File**: `apps/backend/search/.env`

### Complete Variable List

#### Azure OpenAI Configuration

| Variable                            | Type   | Required | Default                  | Description                              |
| ----------------------------------- | ------ | -------- | ------------------------ | ---------------------------------------- |
| `AZURE_OPENAI_ENDPOINT`             | URL    | Yes      | -                        | Azure OpenAI service endpoint            |
| `AZURE_OPENAI_API_KEY`              | String | Yes      | -                        | Azure OpenAI API key (from Azure Portal) |
| `AZURE_OPENAI_CHAT_DEPLOYMENT`      | String | Yes      | `gpt-4o`                 | Chat completion deployment name          |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` | String | Yes      | `text-embedding-3-small` | Embeddings deployment name               |
| `AZURE_OPENAI_API_VERSION`          | String | Yes      | `2025-01-01-preview`     | API version for Azure OpenAI             |

**Example**:

```env
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=sk-abc123...xyz
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

**Legacy Variables** (deprecated but still supported):

- `AZURE_OPENAI_SERVICE` → use `AZURE_OPENAI_ENDPOINT` instead
- `AZURE_OPENAI_CHATGPT_DEPLOYMENT` → use `AZURE_OPENAI_CHAT_DEPLOYMENT`
- `AZURE_OPENAI_CHATGPT_MODEL` → use `AZURE_OPENAI_CHAT_DEPLOYMENT`
- `AZURE_OPENAI_EMBEDDING_MODEL` → use `AZURE_OPENAI_EMBEDDING_DEPLOYMENT`

#### Database Configuration

| Variable       | Type              | Required | Default | Description                                   |
| -------------- | ----------------- | -------- | ------- | --------------------------------------------- |
| `DATABASE_URL` | Connection String | Yes      | -       | PostgreSQL connection string (pooled)         |
| `DIRECT_URL`   | Connection String | Yes      | -       | Direct PostgreSQL connection (for migrations) |

**Example**:

```env
DATABASE_URL=postgresql://pgadmin:SecurePassword123@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
DIRECT_URL=postgresql://pgadmin:SecurePassword123@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
```

**Format**:

```
postgresql://[user]:[password]@[host]:[port]/[database]?[options]
```

**Important Notes**:

- `DATABASE_URL` can point to a connection pooler (e.g., PgBouncer)
- `DIRECT_URL` must bypass pooler for migrations (Prisma requirement)
- In most cases, they can be the same value
- Always use `sslmode=require` for Azure PostgreSQL

#### Search / RAG Storage

Search and retrieval use **Postgres + pgvector** in the shared database:

- Table: `knowledge_base_sections`
- Database: `apexcoachai` on `pg-shared-apps-eastus2`

No additional Azure Search env vars are required.

#### Azure Storage Configuration

| Variable                          | Type   | Required | Default             | Description                      |
| --------------------------------- | ------ | -------- | ------------------- | -------------------------------- |
| `AZURE_STORAGE_ACCOUNT_NAME`      | String | Yes      | `stmahumsharedapps` | Storage account name             |
| `AZURE_STORAGE_CONNECTION_STRING` | String | Yes      | -                   | Full connection string with keys |
| `AZURE_STORAGE_CONTAINER`         | String | Yes      | `apexcoachai`       | Blob container name              |
| `AZURE_STORAGE_BLOB_ENDPOINT`     | URL    | No       | Auto-generated      | Blob service endpoint (optional) |

**Example**:

```env
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=stmahumsharedapps;AccountKey=abc123...;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER=apexcoachai
```

**Finding Values**:

- Azure Portal → `stmahumsharedapps` → Access keys → Connection string

#### Application Configuration

| Variable     | Type   | Required | Default       | Description                                            |
| ------------ | ------ | -------- | ------------- | ------------------------------------------------------ |
| `NODE_ENV`   | String | No       | `development` | Environment mode (`development`, `production`, `test`) |
| `PORT`       | Number | No       | `3000`        | Server port                                            |
| `JWT_SECRET` | String | Yes      | -             | Secret key for JWT token signing                       |
| `LOG_LEVEL`  | String | No       | `info`        | Logging level (`debug`, `info`, `warn`, `error`)       |

**Example**:

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-key-min-32-chars
LOG_LEVEL=info
```

**Generating JWT Secret**:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### Application Insights (Optional)

| Variable                                | Type   | Required | Default | Description                                  |
| --------------------------------------- | ------ | -------- | ------- | -------------------------------------------- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | String | No       | -       | Azure Application Insights connection string |

**Example**:

```env
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=a78dfc6c-7ff6-44cf-af04-2b2f10e2ff8a;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/
```

---

## Backend Indexer Configuration

**Service**: `apps/backend/indexer`
**Port**: 3001
**File**: `apps/backend/indexer/.env`

The indexer service shares most configuration with the search API but does not need database access.

### Required Variables

#### Azure OpenAI (same as search API)

```env
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

Search data is stored in Postgres via the indexer service and queried by RAG approaches using pgvector.

#### Azure Storage (same as search API)

```env
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<your_connection_string>
AZURE_STORAGE_CONTAINER=apexcoachai
```

#### Application Settings

```env
NODE_ENV=production
PORT=3001
```

### Legacy Variables (Still Supported)

The indexer may still reference these deprecated variables for Azure OpenAI and storage:

```env
AZURE_OPENAI_SERVICE=shared-openai-eastus2
AZURE_OPENAI_CHATGPT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_MODEL=text-embedding-3-small
AZURE_STORAGE_ACCOUNT=stmahumsharedapps
```

---

## Frontend Configuration

**Service**: `apps/frontend`
**Port**: 5173 (dev), 80/443 (production)
**File**: `apps/frontend/.env`

### Environment Variables

| Variable              | Type | Required | Default                 | Description          |
| --------------------- | ---- | -------- | ----------------------- | -------------------- |
| `VITE_SEARCH_API_URI` | URL  | Yes      | `http://localhost:3000` | Backend API base URL |

**Development**:

```env
VITE_SEARCH_API_URI=http://localhost:3000
```

**Production**:

```env
VITE_SEARCH_API_URI=https://api.apexcoachai.shtrial.com
```

### Build-Time Configuration

The frontend also has hardcoded fallback in `vite.config.ts`:

```typescript
const PROD_API_URL = 'https://api.apexcoachai.shtrial.com';

const apiUrl =
  process.env.BACKEND_URI ||
  (process.env.NODE_ENV === 'production' ? PROD_API_URL : '');
```

**Priority**:

1. `BACKEND_URI` environment variable (highest)
2. `VITE_SEARCH_API_URI` in `.env`
3. Hardcoded `PROD_API_URL` if `NODE_ENV=production`
4. Empty string (uses Vite proxy in dev)

---

## Shared Azure Resources

### Resource Naming Convention

All ApexCoachAI resources use the prefix or container name `apexcoachai`.

### Azure Subscription

```
Subscription ID: 44e77ffe-2c39-4726-b6f0-2c733c7ffe78
Region: East US 2
```

### Resource Groups

| Resource Group             | Purpose          | Resources                   |
| -------------------------- | ---------------- | --------------------------- |
| `rg-shared-ai`             | AI Services      | Azure OpenAI, AI Search     |
| `rg-shared-data`           | Data Storage     | PostgreSQL, Blob Storage    |
| `rg-shared-container-apps` | Backend Services | Container Apps, ACR         |
| `rg-shared-web`            | Frontend         | Static Web Apps             |
| `rg-shared-logs`           | Monitoring       | Log Analytics, App Insights |

### Shared Services Reference

#### Azure OpenAI

```
Name: shared-openai-eastus2
Endpoint: https://shared-openai-eastus2.openai.azure.com/
Resource Group: rg-shared-ai
```

**Deployments**:

- `gpt-4o` - Chat completions
- `text-embedding-3-small` - Embeddings
- `gpt-image-1-mini` - Image generation (future use)

#### PostgreSQL

```
Server: pg-shared-apps-eastus2.postgres.database.azure.com
Database: apexcoachai
Port: 5432
SSL Mode: Require
Resource Group: rg-shared-data
```

**Access**:

- Firewall rules required for external access
- Contact DBA to add your IP

#### Search / RAG (Postgres + pgvector)

```
Database: apexcoachai (Postgres)
Table: knowledge_base_sections
Server: pg-shared-apps-eastus2.postgres.database.azure.com
Resource Group: rg-shared-data
```

#### Azure Storage

```
Account: stmahumsharedapps
Container: apexcoachai
Endpoint: https://stmahumsharedapps.blob.core.windows.net/
Resource Group: rg-shared-data
```

#### Container Registry

```
Registry: shacrapps.azurecr.io
Images:
  - apexcoachai-api
  - apexcoachai-indexer
Resource Group: rg-shared-container-apps
```

#### Container Apps

```
Environment: cae-shared-apps
Apps:
  - apexcoachai-api (port 3000)
  - apexcoachai-indexer (port 3001)
Resource Group: rg-shared-container-apps
```

#### Static Web App

```
Name: apexcoachai
Custom Domain: https://apexcoachai.shtrial.com
SKU: Free
Resource Group: rg-shared-web
```

---

## Security Best Practices

### Never Commit Secrets

**❌ DO NOT**:

```env
# .env (committed to git)
AZURE_OPENAI_API_KEY=sk-real-key-12345
DATABASE_URL=postgresql://user:RealPassword@host/db
```

**✅ DO**:

```env
# .env.example (committed to git)
AZURE_OPENAI_API_KEY=<your_azure_openai_key>
DATABASE_URL=postgresql://user:<password>@host/db
```

### Use Strong JWT Secrets

```bash
# Generate a strong 32-byte random secret
openssl rand -base64 32

# Minimum length: 32 characters
# Include mix of upper/lower/numbers/symbols
```

### Rotate Credentials Regularly

- **Azure API Keys**: Rotate every 90 days
- **Database Passwords**: Rotate every 90 days
- **JWT Secrets**: Rotate when compromised or quarterly

### Azure Key Vault (Future Enhancement)

Currently, secrets are stored in:

- Local `.env` files (development)
- Azure Container App Application Settings (production)

**Recommended**: Migrate to Azure Key Vault for centralized secret management.

---

## Environment-Specific Settings

### Development

```env
NODE_ENV=development
VITE_SEARCH_API_URI=http://localhost:3000
LOG_LEVEL=debug
```

**Characteristics**:

- Hot reload enabled
- Verbose logging
- Local services on localhost
- Development Azure resources or mocks

### Staging (Future)

```env
NODE_ENV=staging
VITE_SEARCH_API_URI=https://api-staging.apexcoachai.shtrial.com
LOG_LEVEL=info
```

**Characteristics**:

- Production-like environment
- Limited logging
- Separate database and resources
- Used for QA testing

### Production

```env
NODE_ENV=production
VITE_SEARCH_API_URI=https://api.apexcoachai.shtrial.com
LOG_LEVEL=warn
```

**Characteristics**:

- Optimized builds
- Minimal logging (warn/error only)
- Production Azure resources
- Strict security policies

---

## Configuration Validation

### Check Required Variables

Create a validation script `scripts/validate-env.sh`:

```bash
#!/bin/bash

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found"
  exit 1
fi

REQUIRED_VARS=(
  "AZURE_OPENAI_API_KEY"
  "DATABASE_URL"
  "DIRECT_URL"
  "AZURE_STORAGE_CONNECTION_STRING"
  "JWT_SECRET"
)

MISSING=()

for VAR in "${REQUIRED_VARS[@]}"; do
  if ! grep -q "^$VAR=" "$ENV_FILE"; then
    MISSING+=("$VAR")
  fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "Error: Missing required variables in $ENV_FILE:"
  printf ' - %s\n' "${MISSING[@]}"
  exit 1
else
  echo "✓ All required variables present in $ENV_FILE"
fi
```

### Test Connections

```bash
# Test database connection
psql "$DATABASE_URL" -c "SELECT version();"

# Test Azure OpenAI
curl "$AZURE_OPENAI_ENDPOINT/openai/deployments?api-version=2025-01-01-preview" \
  -H "api-key: $AZURE_OPENAI_API_KEY"

```

---

## Troubleshooting

### Issue: Variable not loading

**Check**:

1. File is named exactly `.env` (not `.env.txt` or similar)
2. No quotes around values (unless value contains spaces)
3. No spaces around `=` sign
4. File is in correct directory (per service)

**Correct format**:

```env
DATABASE_URL=postgresql://user:pass@host/db
```

**Incorrect**:

```env
DATABASE_URL = "postgresql://user:pass@host/db"
```

### Issue: Database connection fails

**Verify**:

- Connection string format is correct
- Password doesn't contain special chars that need escaping
- `sslmode=require` is present
- Firewall allows your IP

### Issue: Azure OpenAI 401 Unauthorized

**Check**:

- API key is correct (no extra spaces)
- Endpoint URL ends with `/`
- API version is supported
- Deployment names match exactly (case-sensitive)

---

## Quick Reference

### Minimal .env for Development

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Database
DATABASE_URL=postgresql://user:pass@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
DIRECT_URL=postgresql://user:pass@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<your_connection_string>
AZURE_STORAGE_CONTAINER=apexcoachai

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=<generate_with_openssl>
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-26
**Maintained By**: ApexCoachAI Team
