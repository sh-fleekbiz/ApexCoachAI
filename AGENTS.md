# AGENTS.md - Apex Coach AI

AI coding agent guide for Apex Coach AI, an AI-powered coaching and development platform that transforms proprietary content into interactive AI coaching experts.

## Project Overview

**Application**: AI-Powered Coaching & Development Platform
**URL**: https://apexcoachai.shtrial.com
**Stack**: Monorepo with React frontend + Fastify search/indexer backends + Azure OpenAI/Azure AI Search
**Target Market**: Content-focused SMBs, coaches, consultants, and training companies
**Monorepo**: Yes (apps/frontend, apps/backend/search, apps/backend/indexer, packages/*)

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
│   ├── frontend/          # React coaching UI
│   └── backend/
│       ├── search/        # Fastify RAG backend
│       └── indexer/       # Content indexing service
├── packages/
│   ├── shared-ai/         # Shared Azure OpenAI client (@shared/ai)
│   ├── shared-data/       # Shared Postgres, Search, Storage clients (@shared/data)
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
```

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
