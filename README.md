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

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Fastify (Node.js, TypeScript)
- **Database**: Azure PostgreSQL (`pg-shared-apps-eastus2`) with pgvector
- **AI**: Azure OpenAI exclusively
  - Chat: `gpt-5.1-mini`
  - Embeddings: `text-embedding-3-small`
- **Search**: Azure AI Search (`shared-search-standard-eastus2`)
- **Storage**: Azure Blob Storage (`stmahumsharedapps`, container: `apexcoachai-content`)
- **Deployment**: 
  - Frontend: Azure Static Web App (`rg-shared-web`)
  - Backend: Azure Container App (`rg-shared-apps`)

## Architecture

- **Monorepo**: pnpm workspaces
- **Packages**:
  - `packages/webapp`: React frontend
  - `packages/search`: Fastify RAG backend
  - `packages/indexer`: Content indexing service

## Environment Variables

See `packages/search/.env.example` for the complete schema. Key variables:

```env
# Azure OpenAI (Standardized - shared across all portfolio apps)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-5.1-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your_key>
AZURE_SEARCH_INDEX=<index_name>
```

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp packages/search/.env.example packages/search/.env
# Edit packages/search/.env with your Azure credentials

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


