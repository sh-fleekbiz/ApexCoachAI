# ApexCoachAI Agents

## Data Storage Naming

Canonical identifiers:

- PostgreSQL database: `apexcoachai_db` (server `pg-shared-apps-eastus2`)
- Blob container: `apexcoachai` (storage account `stmahumsharedapps`)

Use these in secrets, IaC modules, and documentation.

# AGENTS.md - Apex Coach AI

AI coding agent guide for Apex Coach AI, an AI-powered coaching and development platform that transforms proprietary content into interactive AI coaching experts.

## Project Overview

**Application**: AI-Powered Coaching & Development Platform
**URL**: https://apexcoachai.shtrial.com
**Stack**: Monorepo with React frontend + Fastify search/indexer backends + Azure OpenAI/Azure AI Search
**Target Market**: Content-focused SMBs, coaches, consultants, and training companies
**Monorepo**: Yes (apps/frontend, apps/backend/search, apps/backend/indexer)

## Business Context

Apex Coach AI is a consumer-to-business (C2B) solution that enables:

- **Coaches & Consultants**: Scale 1-on-1 coaching without sacrificing personalization
- **Training Companies**: Turn course libraries into interactive learning assistants
- **Startup Founders**: Provide consistent onboarding for growing teams
- **Professional Services**: Deliver client support backed by proprietary methodologies

**Key Value Proposition**: Turn proprietary videos and training materials into a 24/7 interactive AI expert that speaks with your authority.

## Project Structure

```
ApexCoachAI/
├── apps/
│   ├── frontend/          # React coaching UI with integrated chat component
│   └── backend/
│       ├── search/        # Fastify RAG backend with integrated data utilities
│       └── indexer/       # Content indexing service with integrated config
```

## Deployment Architecture

**Current Deployment**: ✅ **Container Apps (Shared Environment)**

- **Frontend**: Azure Static Web App `apexcoachai` in `rg-shared-web` (Free SKU)
- **Backend API**: Azure Container App `apexcoachai-api` in shared environment:
  - Environment: `cae-shared-apps` (in `rg-shared-apps`)
  - Registry: `shacrapps.azurecr.io`
  - Image: `shacrapps.azurecr.io/apexcoachai-search:latest`
  - Compute: Consumption plan (scales to zero)
- **Indexer**: Azure Container App `apexcoachai-indexer` in shared environment:
  - Environment: `cae-shared-apps` (in `rg-shared-apps`)
  - Registry: `shacrapps.azurecr.io`
  - Image: `shacrapps.azurecr.io/apexcoachai-indexer:latest`
  - Compute: Consumption plan (scales to zero)
- **Custom Domain**: `apexcoachai.shtrial.com`

## Custom Domains

- Frontend: `https://apexcoachai.shtrial.com`
- Backend API: `https://api.apexcoachai.shtrial.com`
- Swagger: `https://api.apexcoachai.shtrial.com/swagger`

DNS Notes: Ensure `api.apexcoachai.shtrial.com` is a CNAME to the Container App FQDN and bind TLS in the Azure portal.

**Shared Resources** (all in shared resource groups):

- Database: `pg-shared-apps-eastus2` (database: `apexcoachai_db`)
- Azure OpenAI: `shared-openai-eastus2` (in `rg-shared-ai`)
- Azure AI Search: `shared-search-standard-eastus2` (in `rg-shared-ai`)
- Storage: `stmahumsharedapps` (in `rg-shared-data`)

**Cost**: ~$5-10/month (frontend + Container Apps on consumption plan)

## Tech Stack

- **Monorepo**: pnpm workspaces with Turborepo
- **Frontend**: React + TypeScript (apps/frontend)
- **Backend**: Node.js + Fastify (apps/backend/search, apps/backend/indexer)
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`, database: `apexcoachai_db`) with pgvector
- **RAG**: Azure OpenAI exclusively
  - Chat: `gpt-4o` (default), `gpt-5.1` (heavy tasks)
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`, index prefix: `apexcoachai`)
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, prefix: `apexcoachai/`)
- **Deployment**:
  - Frontend: Azure Static Web App `apexcoachai` in `rg-shared-web` (Free SKU)
  - Backend: Azure Container Apps `apexcoachai-api` and `apexcoachai-indexer` in `rg-shared-apps` (Consumption plan)
- **Custom Domain**: `apexcoachai.shtrial.com`

## Build & Test Commands

All commands are executable and tested. Copy-paste ready:

```bash
# Install dependencies (run from repo root)
pnpm install

# Development (starts all services: frontend, search API, indexer)
pnpm dev
# Frontend only: pnpm dev --filter=frontend
# Search API only: pnpm dev --filter=search
# Indexer only: pnpm dev --filter=indexer

# Build (production build)
pnpm build            # Build all packages
pnpm build --filter=frontend   # Frontend only
pnpm build --filter=search     # Search API only
pnpm build --filter=indexer    # Indexer only

# Testing
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # TypeScript type checking
```

**Before committing**: Always run `pnpm lint && pnpm typecheck && pnpm test`

## Coding Conventions

**Good Examples** (refer to these files):
- Frontend components: `apps/frontend/src/components/*.tsx`
- Search API routes: `apps/backend/search/src/routes/*.ts`
- Indexer services: `apps/backend/indexer/src/services/*.ts`

**Patterns**:
- Follow monorepo structure (apps/frontend, apps/backend/search, apps/backend/indexer)
- Use shared Azure OpenAI resources (never create app-specific resources)
- TypeScript strict mode (enforced in tsconfig.json)
- Meaningful package names (use descriptive names, not abbreviations)
- Fastify for backend APIs (not Express)
- Use shared data utilities from backend packages

**Bad Examples** (avoid):
- ❌ Creating new Azure OpenAI resources per app
- ❌ Mixing Express and Fastify patterns
- ❌ Hardcoded API endpoints or credentials

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `apps/backend/search/.env.example` and `apps/backend/indexer/.env.example` for complete schemas. Key variables:

```env
# Azure OpenAI (shared across all services)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-4o
AZURE_OPENAI_MODEL_HEAVY=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small

# PostgreSQL (shared)
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require

# Azure AI Search (shared)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX_PREFIX=apexcoachai

# Azure Storage (shared)
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
APP_STORAGE_PREFIX=apexcoachai
```

## Testing Requirements

**Before every commit**:
```bash
pnpm lint && pnpm typecheck && pnpm test
```

**Test Coverage**:
- Add unit tests for new services
- Test RAG pipeline with sample coaching content
- Verify content indexing accuracy
- Test search API endpoints

## PR Guidelines

- Title: `[Apex Coach AI] Description`
- All tests passing (`pnpm test`)
- No TypeScript errors (`pnpm typecheck`)
- Linting passes (`pnpm lint`)
- Content indexing features tested

## Prohibited Patterns

❌ **Never**:

- Use non-Azure AI providers as primary
- Use OpenAI.com API (only Azure OpenAI)
- Hardcode API keys or credentials
- Bypass input validation
- Skip content processing validation

## Resources

- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/CONFIG.md` - Environment variables and configuration guide
- [Azure OpenAI Docs](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Fastify Docs](https://www.fastify.io/)
