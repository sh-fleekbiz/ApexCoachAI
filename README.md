# Apex Coach AI - AI-Powered Coaching Platform

**Industry**: Education/Coaching
**Domain**: https://apexcoachai.shtrial.com
**Type**: Full-stack AI Application

## Overview

Apex Coach AI transforms proprietary coaching content (videos, documents, training materials) into interactive AI coaching experts, enabling coaches and training companies to scale personalized learning experiences.

## Key AI Features

- **RAG-Powered Coaching**: Vector search over proprietary content for context-aware responses
- **Multi-Modal Learning**: Support for video, text, and structured content
- **Personalized Recommendations**: AI-driven content suggestions based on learner progress
- **Interactive Chat Interface**: Natural language Q&A with citation-backed responses

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Fastify (Node.js, TypeScript)
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `apexcoachai_db`) with pgvector
- **AI**: Azure OpenAI exclusively (via `@shared/ai` package)
  - Chat: `gpt-5.1`
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`, index: `apexcoachai-dev-index`)
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `apexcoachai`) in `rg-shared-data`
- **Deployment**:
  - Frontend: Azure Static Web App `apexcoachai` in `rg-shared-web` (Free SKU)
  - Backend: Azure Container Apps `apexcoachai-api` and `apexcoachai-indexer` in `cae-shared-apps` (Consumption plan)
    - Container Apps Environment: `cae-shared-apps` in `rg-shared-apps`
    - Images: `shacrapps.azurecr.io/apexcoachai-api:latest`, `shacrapps.azurecr.io/apexcoachai-indexer:latest`
- **Custom Domains**:
  - Frontend: `https://apexcoachai.shtrial.com`
  - Backend API: `https://api.apexcoachai.shtrial.com`
  - Swagger UI: `https://api.apexcoachai.shtrial.com/swagger`

## Architecture

- **Monorepo**: pnpm workspaces with Turborepo
- **Apps**:
  - `apps/frontend`: React frontend
  - `apps/backend/search`: Fastify RAG backend
  - `apps/backend/indexer`: Content indexing service
- **Packages**:
  - `packages/shared-ai`: Shared Azure OpenAI client (`@shared/ai`)
  - `packages/shared-data`: Shared Postgres, Search, Storage clients (`@shared/data`)
  - `packages/shared`: Shared types and utilities
  - `packages/ui`: Shared UI components

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/CONFIG.md` and `.env.example` for the complete schema. Key variables:

```env
# Azure OpenAI (Shared - via @shared/ai package)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small
AZURE_OPENAI_MODEL_IMAGE=gpt-image-1-mini

# PostgreSQL (Shared - via @shared/data package)
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require

# Azure AI Search (Shared - via @shared/data package)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX=apexcoachai-dev-index

# Azure Storage (Shared - via @shared/data package)
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=apexcoachai
```

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp apps/backend/search/.env.example apps/backend/search/.env
cp apps/backend/indexer/.env.example apps/backend/indexer/.env
cp apps/frontend/.env.example apps/frontend/.env
# Edit the .env files with your Azure credentials

# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm test             # Run tests
```

## AI Roadmap

- ✅ **Current**: RAG-powered Q&A, content indexing
- 🔄 **Near-term**: Multi-agent coaching workflows, progress tracking
- 📋 **Future**: Adaptive learning paths, automated assessment generation

## Deployment

Deployed via GitHub Actions workflow (`.github/workflows/deploy.yml`):

- Frontend → Azure Static Web App
- Backend → Azure Container App
