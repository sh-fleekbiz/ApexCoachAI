# ApexCoachAI Configuration

## Environment Variables

All configuration is done via environment variables. **No Key Vault** is used. **No OpenAI.com API keys** - only Azure OpenAI.

## Backend Environment Variables

Location: `apps/backend/search/.env` or App Settings in Azure Container Apps

### Azure OpenAI (Shared)

```bash
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<azure-openai-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-4o
AZURE_OPENAI_MODEL_HEAVY=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small
AZURE_OPENAI_MODEL_IMAGE=gpt-image-1-mini
```

### PostgreSQL (Shared)

```bash
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require
```

### Azure AI Search (Shared)

```bash
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<search-key>
AZURE_SEARCH_INDEX_PREFIX=apexcoachai
```

### Azure Storage (Shared)

```bash
AZURE_STORAGE_CONNECTION_STRING=<storage-connection-string>
APP_STORAGE_PREFIX=apexcoachai
```

### Demo Login

```bash
ENABLE_DEMO_LOGIN=true  # Set to 'true' to enable demo login endpoints
```

## Frontend Environment Variables

Location: `apps/frontend/.env` or App Settings in Azure Static Web App

```bash
VITE_SEARCH_API_URI=https://<apexcoachai-api-url>
VITE_APP_NAME=ApexCoachAI
```

## App-Specific Configuration

### Database

- **Database name**: `apexcoachai_db`
- **Schema**: App-specific tables within `apexcoachai_db`

### Search Indexes

- **Index prefix**: `apexcoachai`
- **Example indexes**: `apexcoachai-content`, `apexcoachai-videos`

### Storage Prefixes

- **Storage prefix**: `apexcoachai/`
- **Example paths**:
  - `raw/apexcoachai/content-uploads/...`
  - `curated/apexcoachai/processed-content/...`
  - `ai-artifacts/apexcoachai/generated-summaries/...`

## Local Development

1. Copy `.env.example` to `.env.local` in `apps/backend/search/` and `apps/frontend/`
2. Fill in the required values from Azure Portal or Azure CLI
3. Ensure you have access to the shared resources

## Production Deployment

Environment variables are set as App Settings in:

- **Static Web App**: Azure Portal → Static Web App `apexcoachai` → Configuration → Application settings
- **Container Apps**: Azure Portal → Container Apps `apexcoachai-api` and `apexcoachai-indexer` → Configuration → Environment variables
