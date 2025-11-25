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
- **RAG**: Azure OpenAI exclusively (via `@shared/ai` package)
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

```bash
pnpm install
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # Lint all packages
```

## Coding Conventions

- Follow monorepo structure
- Use shared Azure OpenAI resources
- TypeScript strict mode
- Meaningful package names

## Environment Variables

See `.env.example`. Use shared Azure OpenAI configuration.

## PR Guidelines

- Title: `[Apex Coach AI] Description`
- All tests passing
- No TypeScript errors

## MCP Integration

Use Context7 MCP for library documentation and best practices.
