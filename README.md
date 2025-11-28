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
- **AI**: Azure OpenAI Responses API (v1 GA) exclusively
  - Chat/Code: `gpt-5.1-codex-mini` (via Responses API)
  - Embeddings: `text-embedding-3-small`
  - Image: `gpt-image-1-mini`
- **Search/RAG**: Postgres + pgvector (table `knowledge_base_sections` in `apexcoachai_db`)
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `apexcoachai`) in `rg-shared-data`
- **Deployment**:
  - Frontend: Azure Static Web App `apexcoachai` in `rg-shared-web` (Free SKU)
  - Backend: Azure Container Apps `apexcoachai-api` and `apexcoachai-indexer` in `cae-shared-apps` (Consumption plan)
    - Container Apps Environment: `cae-shared-apps` in `rg-shared-apps`
    - Images: `shacrapps.azurecr.io/apexcoachai-api:latest`, `shacrapps.azurecr.io/apexcoachai-indexer:latest`
- **Custom Domains**:
  - Frontend: `https://apexcoachai.shtrial.com`
  - Backend API: `https://api.apexcoachai.shtrial.com`
  - Swagger UI: `https://api.apexcoachai.shtrial.com/docs`

## Demo URLs

- **Frontend**: https://apexcoachai.shtrial.com
- **API Base URL**: https://api.apexcoachai.shtrial.com
- **API Documentation**: https://api.apexcoachai.shtrial.com/docs

## End-to-end Testing

This project uses Playwright for E2E tests.

```bash
pnpm install
pnpm test:e2e
```

The `pretest:e2e` hook automatically runs `pnpm exec playwright install` to ensure browsers are installed before tests run.

## Architecture

- **Monorepo**: pnpm workspaces
- **Apps**:
  - `apps/web`: React frontend with integrated chat component
  - `apps/services/search`: Fastify RAG backend with integrated data utilities
  - `apps/services/indexer`: Content indexing service with integrated config utilities

## Environment Variables

**No Key Vault**: All secrets/config via App Settings and environment variables.

**No OpenAI.com**: Only Azure OpenAI endpoint (`shared-openai-eastus2`).

See `docs/DEPLOYMENT_GUIDE.md` for the complete environment variable schema and detailed setup instructions. Key variables:

```env
# Azure OpenAI Responses API (v1 GA)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_RESPONSES_URL=https://shared-openai-eastus2.cognitiveservices.azure.com/openai/v1/responses
AZURE_OPENAI_EMBEDDING_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/openai/deployments/text-embedding-3-small/embeddings?api-version=2023-05-15

# Model Configuration
AI_MODEL_GENERAL=gpt-5.1-codex-mini
AI_MODEL_EMBEDDING=text-embedding-3-small
AI_MODEL_IMAGE=gpt-image-1-mini

# PostgreSQL
DATABASE_URL=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
DIRECT_URL=postgresql://<user>:<pass>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=apexcoachai

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=<generate_strong_secret>
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
# Copy example environment file
cp .env.example .env

# Edit the .env file with your Azure credentials
# See docs/DEPLOYMENT_GUIDE.md for detailed configuration and deployment guidance
```

### 4. Set Up Database

```bash
# Navigate to search backend
cd apps/services/search

# Generate Prisma client
pnpm prisma generate

# Run migrations (creates database schema)
pnpm prisma migrate dev --name init

# (Optional) Seed demo data
pnpm seed:demo

cd ../../..
```

**Note**: See `docs/DEPLOYMENT_GUIDE.md` for detailed database and deployment setup instructions.

## Development

### Running the Application

```bash
# Start all services (recommended)
pnpm dev

# Or run individually:
pnpm dev:web       # Frontend only (apps/web)
pnpm dev:search    # Search API only (apps/services/search)
pnpm dev:indexer   # Indexer service only (apps/services/indexer)
```

**Important**: Use `pnpm dev` (or the `dev:*` scripts) for interactive development. `pnpm build` is for production builds only.

**For detailed deployment and configuration guidance**, see `docs/DEPLOYMENT_GUIDE.md`.

### Available Commands

```bash
# Development
pnpm dev                    # Start all services with hot-reload
pnpm dev:search             # Start specific service (search API)

# Building
pnpm build                  # Build all apps for production
pnpm build --filter=search # Build specific app

# Testing
pnpm test                   # Run all tests
pnpm test --filter=search  # Run tests for specific app
pnpm lint                   # Lint all code
pnpm typecheck             # TypeScript type checking

# Database
cd apps/services/search
pnpm prisma migrate dev    # Create and apply migrations
pnpm prisma studio         # Open Prisma Studio
```

### Project Structure

```
ApexCoachAI/
├── apps/
│   ├── web/               # React frontend (Vite)
│   │   └── src/
│   │       ├── components/  # React components (chat, knowledge-base, etc.)
│   │       ├── features/    # Feature-based modules
│   │       ├── pages/       # Page/route components
│   │       ├── hooks/       # Custom React hooks
│   │       ├── services/    # API clients
│   │       ├── contexts/    # React contexts (Auth, Personality, etc.)
│   │       └── types/       # Shared TypeScript types
│   └── services/
│       ├── search/          # Fastify RAG API
│       │   ├── src/
│       │   │   ├── routes/    # API routes
│       │   │   ├── services/  # Business logic
│       │   │   └── lib/       # Utilities
│       │   └── prisma/        # Prisma schema and migrations
│       └── indexer/          # Content indexing service
│           └── src/
│               ├── routes/    # Indexing API routes
│               └── lib/       # Document processors
├── .github/                  # Copilot instructions, PR templates (no CI/CD workflows)
├── docs/                     # Core documentation (see DEPLOYMENT_GUIDE.md)
└── scripts/                  # Deployment and maintenance scripts
```

## AI Roadmap

- **Current**: RAG-powered Q&A, content indexing
- **Near-term**: Multi-agent coaching workflows, progress tracking
- **Future**: Adaptive learning paths, automated assessment generation

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
- Verify Azure PostgreSQL connection is correct

**For more help**:

- See `docs/DEPLOYMENT_GUIDE.md` for deployment, configuration, and troubleshooting details
- See `AGENTS.md` for shared infrastructure and governance rules
- Check service logs in Azure Portal

## Deployment

### Manual Deployment

For step-by-step manual deployment instructions, see **`docs/DEPLOYMENT_GUIDE.md`**.

Quick deployment using included scripts:

```bash
# Deploy backend services (builds images and updates Azure Container Apps)
./scripts/deploy-backend.sh

# Deploy frontend (builds and uploads to Static Web App)
./scripts/deploy-frontend.sh

# Or deploy everything at once
./scripts/deploy-full.sh

# Run smoke tests after deployment
./scripts/smoke-test.sh
```

### Automated Deployment (Scripts, No CI/CD Workflows)

Per `AGENTS.md`, this repo does **not** define or manage CI/CD pipelines (no `.github/workflows/*`, no Azure Pipelines).
Deployment automation is handled via the PowerShell/Bash scripts in `scripts/` and the steps in `docs/DEPLOYMENT_GUIDE.md`.

## License

[Add your license here]

## Contact & Support

- **Live Site**: https://apexcoachai.shtrial.com
- **API Documentation**: https://api.apexcoachai.shtrial.com/docs
- **Issues**: [GitHub Issues](https://github.com/your-org/apexcoachai/issues)

## ☁️ Infrastructure (MahumTech Shared Platform)

ApexCoachAI runs on the **MahumTech Shared Azure Platform**.

- **Subscription:** `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`
- **Region:** East US 2
- **App Slug:** `apexcoachai`

### Shared Resource Groups (no new RGs allowed)

| Resource Group             | Purpose                                                                          |
| :------------------------- | :------------------------------------------------------------------------------- |
| `rg-shared-ai`             | Azure OpenAI `shared-openai-eastus2`                                            |
| `rg-shared-data`           | PostgreSQL `pg-shared-apps-eastus2`, Storage `stmahumsharedapps`                 |
| `rg-shared-container-apps` | Container Apps environments, ACR `acrsharedapps`                                 |
| `rg-shared-web`            | Static Web Apps                                                                  |
| `rg-shared-logs`           | Log Analytics `law-shared-apps-eastus2`, App Insights `appi-shared-apps-eastus2` |
| `rg-shared-dns`            | DNS zones, certificates                                                          |

App-specific resources (all on shared services):

| Resource       | Name                      | Service                          |
| :------------- | :------------------------ | :------------------------------- |
| Database       | `apexcoachai_db`          | `pg-shared-apps-eastus2`         |
| Blob Container | `apexcoachai`             | `stmahumsharedapps`              |
| RAG Vectors    | `knowledge_base_sections` | `pg-shared-apps-eastus2`         |
| Static Web App | `apexcoachai`             | `rg-shared-web`                  |
| Container App  | `ca-apexcoachai-api`      | `rg-shared-container-apps`       |

> **⚠️ Important:** Contributors and AI agents must **not** create new resource groups, PostgreSQL servers, storage accounts, or OpenAI/Search accounts. Extend the shared platform instead.

See [`AGENTS.md`](./AGENTS.md) for detailed agent contract and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) for Copilot rules.
