# ApexCoachAI Architecture

## Overview

ApexCoachAI is a full-stack AI application built as a monorepo using pnpm workspaces and Turborepo. It leverages shared Azure resources and standardized packages for AI, data access, and infrastructure.

## Monorepo Structure

```
ApexCoachAI/
├── apps/
│   ├── frontend/          # React frontend
│   └── backend/
│       ├── search/         # Fastify RAG backend
│       └── indexer/        # Content indexing service
├── packages/
│   ├── shared-ai/         # Shared Azure OpenAI client (@shared/ai)
│   ├── shared-data/       # Shared Postgres, Search, Storage clients (@shared/data)
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
├── infra/
│   ├── azure/             # Azure deployment configs (Bicep)
│   └── docker/            # Docker Compose for local development
├── .github/
│   └── workflows/         # CI/CD workflows
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── turbo.json             # Turborepo pipeline
```

## Shared Azure Resources

All resources are deployed to shared resource groups in the MahumTech subscription (East US 2):

### Resource Groups

- **`rg-shared-web`**: Frontend deployment
  - Static Web App: `apexcoachai` (Free SKU)
  - Custom domain: `apexcoachai.shtrial.com`

- **`rg-shared-apps`**: Backend deployment
  - Container App: `apexcoachai-api` (search service)
  - Container App: `apexcoachai-indexer` (indexing service)
  - Container Registry: `shacrapps`
  - Container Apps Environment: `cae-shared-apps`

- **`rg-shared-ai`**: AI services
  - Azure OpenAI: `shared-openai-eastus2`
    - Endpoint: `https://shared-openai-eastus2.openai.azure.com/openai/v1/`
    - Deployments: `gpt-4o`, `gpt-5.1`, `text-embedding-3-small`, `gpt-image-1-mini`
  - Azure AI Search: `shared-search-standard-eastus2`
    - Endpoint: `https://shared-search-standard-eastus2.search.windows.net`
    - Index prefix: `apexcoachai` (e.g., `apexcoachai-content`)

- **`rg-shared-data`**: Data services
  - PostgreSQL: `pg-shared-apps-eastus2`
    - Database: `apex_db`
    - Connection: `pg-shared-apps-eastus2.postgres.database.azure.com:5432`
    - Extensions: pgvector
  - Storage: `stmahumsharedapps`
    - Containers: `raw`, `curated`, `ai-artifacts`
    - Prefix: `apexcoachai/` (e.g., `raw/apexcoachai/...`)

- **`rg-shared-dns`**: DNS zones
  - Zone: `shtrial.com`
  - Record: `apexcoachai.shtrial.com` → Static Web App

## Shared Packages

### `@shared/ai`

Provides standardized Azure OpenAI client functions:

- `chatComplete()`: Non-streaming chat completions
- `chatStream()`: Streaming chat completions
- `embedText()`: Text embeddings
- `generateImage()`: Image generation

### `@shared/data`

Provides clients for shared data services:

- **Postgres**: `getPgPool()`, `withClient()`
- **Azure Search**: `getSearchClient(indexName)`, `getSearchIndexClient()`
- **Azure Storage**: `getContainerClient(containerName)`

## Deployment

### Frontend

- **Service**: Azure Static Web App `apexcoachai` in `rg-shared-web`
- **Domain**: `apexcoachai.shtrial.com`
- **Build**: Vite build output in `apps/frontend/dist`
- **CI/CD**: GitHub Actions workflow deploys on push to `main`

### Backend

- **Search Service**: Azure Container App `apexcoachai-api` in `rg-shared-apps`
- **Indexer Service**: Azure Container App `apexcoachai-indexer` in `rg-shared-apps`
- **Images**: `shacrapps.azurecr.io/apexcoachai-api:latest`, `shacrapps.azurecr.io/apexcoachai-indexer:latest`
- **CI/CD**: GitHub Actions workflow builds Docker images and updates Container Apps

## Configuration

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/CONFIG.md` for detailed environment variable documentation.
