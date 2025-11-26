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
- **AI**: Azure OpenAI exclusively
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

## Demo URLs

- **Frontend**: https://apexcoachai.shtrial.com
- **API Base URL**: https://api.apexcoachai.shtrial.com
- **API Docs**: https://api.apexcoachai.shtrial.com/docs

## End-to-end Testing

This project uses Playwright for E2E tests.

```bash
pnpm install
pnpm test:e2e
```

The `pretest:e2e` hook automatically runs `pnpm exec playwright install` to ensure browsers are installed before tests run.

## Architecture

- **Monorepo**: pnpm workspaces with Turborepo
- **Apps**:
  - `apps/frontend`: React frontend with integrated chat component
  - `apps/backend/search`: Fastify RAG backend with integrated data utilities
  - `apps/backend/indexer`: Content indexing service with integrated config utilities

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/CONFIG.md` and `.env.example` for the complete schema. Key variables:

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/openai/v1/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_DEFAULT_CHAT_MODEL=gpt-5.1
AZURE_OPENAI_MODEL_EMBED=text-embedding-3-small
AZURE_OPENAI_MODEL_IMAGE=gpt-image-1-mini

# PostgreSQL
SHARED_PG_CONNECTION_STRING=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key>
AZURE_SEARCH_INDEX=apexcoachai-dev-index

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=apexcoachai
```

## Prerequisites

Before you begin, ensure you have:

- **Node.js**: >=20.0.0
- **pnpm**: >=8.0.0 (`npm install -g pnpm`)
- **Azure Account**: Access to shared Azure resources
- **Docker**: For local development (optional)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ApexCoachAI
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
# Copy example environment files
cp apps/backend/search/.env.example apps/backend/search/.env
cp apps/backend/indexer/.env.example apps/backend/indexer/.env
cp apps/frontend/.env.example apps/frontend/.env

# Edit the .env files with your Azure credentials
# See docs/CONFIG.md for detailed instructions
```

### 4. Set Up Database

```bash
# Run Prisma migrations
cd apps/backend/search
pnpm prisma migrate dev

# (Optional) Seed demo data
pnpm seed:demo
```

## Development

### Running the Application

```bash
# Start all services (recommended)
pnpm dev

# Or run individually:
pnpm dev --filter=frontend    # Frontend only
pnpm dev --filter=search      # Search API only
pnpm dev --filter=indexer     # Indexer service only
```

**Important**: Use `pnpm dev` for development - it enables hot-reload via Turborepo. Don't run `pnpm build` during interactive development.

### Available Commands

```bash
# Development
pnpm dev                    # Start all services with hot-reload
pnpm dev --filter=search    # Start specific service

# Building
pnpm build                  # Build all apps for production
pnpm build --filter=search # Build specific app

# Testing
pnpm test                   # Run all tests
pnpm test --filter=search  # Run tests for specific app
pnpm lint                   # Lint all code
pnpm typecheck             # TypeScript type checking

# Database
cd apps/backend/search
pnpm prisma migrate dev    # Create and apply migrations
pnpm prisma studio         # Open Prisma Studio
```

### Project Structure

```
ApexCoachAI/
├── apps/
│   ├── frontend/          # React frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/  # React components (chat, knowledge-base, etc.)
│   │   │   ├── pages/      # Page components
│   │   │   ├── api/        # API client
│   │   │   └── contexts/   # React contexts (Auth, Personality)
│   ├── backend/
│   │   ├── search/        # Fastify RAG API
│   │   │   ├── src/
│   │   │   │   ├── routes/  # API routes
│   │   │   │   ├── rag/     # RAG client and logic
│   │   │   │   └── db/      # Database repositories
│   │   │   └── prisma/      # Prisma schema and migrations
│   │   └── indexer/        # Content indexing service
│   │       └── src/
│   │           ├── lib/     # Document processors
│   │           └── routes/  # Indexing API routes
├── .github/
│   └── workflows/        # CI/CD pipelines
└── docs/                 # Additional documentation
```

## AI Roadmap

- ✅ **Current**: RAG-powered Q&A, content indexing
- 🔄 **Near-term**: Multi-agent coaching workflows, progress tracking
- 📋 **Future**: Adaptive learning paths, automated assessment generation

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Create a branch**: `git checkout -b feature/your-feature-name`
2. **Make changes**: Follow coding standards (see [`.github/copilot-instructions.md`](./.github/copilot-instructions.md))
3. **Test your changes**: `pnpm lint && pnpm typecheck && pnpm test`
4. **Commit**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
5. **Push and create PR**: Target `main` branch

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Testing**: Add tests for new features, maintain >80% coverage
- **Documentation**: Update relevant docs when adding features
- **RAG**: Always include citations in responses, test retrieval quality

See [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for detailed coding standards.

### PR Guidelines

- **Title**: `[ApexCoachAI] Description` format
- **Description**: Include what changed and why
- **Tests**: All tests must pass
- **Type Safety**: No TypeScript errors
- **RAG Features**: Test with sample content, verify citations

## Troubleshooting

### Common Issues

**Database Connection Errors**:
- Verify `SHARED_PG_CONNECTION_STRING` in `.env` is correct
- Check database exists: `apexcoachai_db` in `pg-shared-apps-eastus2`
- Run migrations: `pnpm prisma migrate dev`

**Azure OpenAI Errors**:
- Verify `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` are set
- Check deployment names match (`gpt-5.1`, `text-embedding-3-small`)
- Ensure you're using Azure OpenAI, not OpenAI.com

**Content Indexing Issues**:
- Verify document format is supported (PDF, text, video transcripts)
- Check Azure Storage connection string is correct
- Verify Azure AI Search index exists and is configured

**For more help**: See `docs/CONFIG.md` or check service logs in Azure Portal

## Deployment

Deployed via GitHub Actions workflow (`.github/workflows/deploy.yml`):

- **Frontend**: Azure Static Web App `apexcoachai` in `rg-shared-web`
- **Backend Services**: Azure Container Apps (`apexcoachai-api`, `apexcoachai-indexer`) in `cae-shared-apps`
- **CI/CD**: Auto-deploys on push to `main` branch

## License

[Add your license here]

## Contact & Support

- **Live Site**: https://apexcoachai.shtrial.com
- **API Documentation**: https://api.apexcoachai.shtrial.com/swagger
- **Issues**: [GitHub Issues](https://github.com/your-org/apexcoachai/issues)

## ☁️ Infrastructure (MahumTech Shared Platform)

ApexCoachAI runs on the **MahumTech Shared Azure Platform**.

- **Subscription:** `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`
- **Region:** East US 2
- **App Slug:** `apexcoachai`

### Shared Resource Groups (no new RGs allowed)

| Resource Group | Purpose |
| :--- | :--- |
| `rg-shared-ai` | Azure OpenAI `shared-openai-eastus2`, AI Search `shared-search-standard-eastus2` |
| `rg-shared-data` | PostgreSQL `pg-shared-apps-eastus2`, Storage `stmahumsharedapps` |
| `rg-shared-container-apps` | Container Apps environments, ACR `acrsharedapps` |
| `rg-shared-web` | Static Web Apps |
| `rg-shared-logs` | Log Analytics `law-shared-apps-eastus2`, App Insights `appi-shared-apps-eastus2` |
| `rg-shared-dns` | DNS zones, certificates |

App-specific resources (all on shared services):

| Resource | Name | Service |
| :--- | :--- | :--- |
| Database | `apexcoachai_db` | `pg-shared-apps-eastus2` |
| Blob Container | `apexcoachai` | `stmahumsharedapps` |
| Search Index | `idx-apexcoachai-primary` | `shared-search-standard-eastus2` |
| Static Web App | `apexcoachai` | `rg-shared-web` |
| Container App | `ca-apexcoachai-api` | `rg-shared-container-apps` |

> **⚠️ Important:** Contributors and AI agents must **not** create new resource groups, PostgreSQL servers, storage accounts, or OpenAI/Search accounts. Extend the shared platform instead.

See [`AGENTS.md`](./AGENTS.md) for detailed agent contract and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for Copilot rules.