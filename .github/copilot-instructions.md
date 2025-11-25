# GitHub Copilot Instructions - ApexCoachAI

This file provides custom instructions for GitHub Copilot to help maintain code quality and consistency across the ApexCoachAI project.

## Project Overview

ApexCoachAI transforms proprietary coaching content (videos, documents, training materials) into interactive AI coaching experts. The platform enables coaches and training companies to scale personalized learning experiences through:

- RAG-powered Q&A over proprietary content
- Multi-modal content support (video, text, structured)
- Personalized content recommendations
- Interactive chat interface with citations

**Tech Stack**: Fastify backend + React frontend + Azure AI Services + Turborepo monorepo

## Coding Standards

### TypeScript

- **Strict Mode**: Always enabled
- **Type Safety**: Never use `any` - use proper types or `unknown` with type guards
- **Naming Conventions**:
  - Functions: `camelCase` (`getUserData`, `processDocument`)
  - Classes: `PascalCase` (`DocumentProcessor`, `RAGClient`)
  - Constants: `UPPER_SNAKE_CASE` (`MAX_CHUNK_SIZE`, `DEFAULT_MODEL`)
  - Interfaces: `PascalCase` (`ChatMessage`, `KnowledgeBaseDocument`)

### Fastify Backend Patterns

**Always use**:
- Fastify plugins for modularity (`fastify-plugin`)
- Type-safe route handlers with Zod schemas
- Async/await for all I/O operations
- Repository pattern for database access
- Shared data utilities from backend packages

**Example - Good**:
```typescript
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1),
  knowledgeBaseId: z.string().uuid(),
});

export const chatRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/chat', {
    schema: {
      body: chatSchema,
    },
  }, async (request, reply) => {
    const { message, knowledgeBaseId } = request.body;
    // Process chat...
  });
};
```

**Example - Bad**:
```typescript
// ❌ No validation
fastify.post('/chat', async (request, reply) => {
  const message = request.body.message; // No type safety
});

// ❌ Synchronous I/O
const data = fs.readFileSync('file.json');
```

### React Frontend Patterns

**Always use**:
- Functional components with TypeScript
- Hooks for state management (`useState`, `useEffect`, `useContext`)
- Type-safe API calls via `src/api/index.ts`
- Context API for global state (AuthContext, PersonalityContext)
- CSS modules for component styling

**Example - Good**:
```typescript
import { useState } from 'react';
import { chatApi } from '@/api';

export function ChatComponent() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSend = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await chatApi.sendMessage({ message });
      setMessages(prev => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return <div>...</div>;
}
```

## Testing Guidelines

### Unit Tests

- **Location**: `apps/backend/**/test/**/*.test.ts` for backend, `apps/frontend/src/**/*.test.tsx` for frontend
- **Coverage**: Aim for >80% coverage on business logic
- **Naming**: `describe('FeatureName', () => { it('should do something', () => { ... }) })`

### Integration Tests

- **Backend**: `apps/backend/**/test/routes/**/*.test.ts` using Fastify test utilities
- **Database**: Use test database, never production data
- **RAG**: Test with sample content, verify embeddings and retrieval

### Test Commands

```bash
# Run all tests
pnpm test

# Run specific app tests
pnpm test --filter=search
pnpm test --filter=indexer
pnpm test --filter=frontend

# Run with coverage
pnpm test --coverage
```

**Before committing**: All tests must pass (`pnpm lint && pnpm typecheck && pnpm test`)

## Build & Deployment

### Development

- **Use Turborepo**: `pnpm dev` (runs all services with hot-reload)
- **Individual services**: `pnpm dev --filter=search`, `pnpm dev --filter=indexer`, `pnpm dev --filter=frontend`
- **Never run production build** during interactive development

### Production Build

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=search
pnpm build --filter=indexer
pnpm build --filter=frontend
```

### Deployment

- **Frontend**: Azure Static Web App (auto-deploys via GitHub Actions)
- **Backend Services**: Azure Container Apps (search API + indexer service)
- **CI/CD**: `.github/workflows/deploy.yml` - deploys on push to `main`
- **Images**: `shacrapps.azurecr.io/apexcoachai-api:latest`, `shacrapps.azurecr.io/apexcoachai-indexer:latest`

## Common Pitfalls

1. **Content Indexing**: Always validate document formats before processing - use format-specific processors
2. **RAG Queries**: Use Azure AI Search for retrieval, not direct vector search - it provides better ranking
3. **Azure Resources**: Always use shared resources - never create app-specific Azure OpenAI or storage accounts
4. **Environment Variables**: Never hardcode values - use config utilities from backend packages
5. **Database Migrations**: Always generate migrations for schema changes - use Prisma migrations

## AI Integration Patterns

### Azure OpenAI Usage

- **Always use** shared Azure OpenAI resources (`shared-openai-eastus2`)
- **Models**:
  - Chat: `gpt-5.1` (default), `gpt-4o` (fallback)
  - Embeddings: `text-embedding-3-small` (for content indexing)
  - Image: `gpt-image-1-mini`
- **Never use** OpenAI.com API directly - only Azure OpenAI endpoint

### RAG Implementation

- **Content Indexing**: Use indexer service to process and chunk documents
- **Embeddings**: Generate embeddings during indexing, store in Azure AI Search
- **Retrieval**: Use Azure AI Search for semantic search, not direct pgvector
- **Citations**: Always include source citations in RAG responses

## File Structure Conventions

```
apps/
├── backend/
│   ├── search/              # Fastify RAG API
│   │   ├── src/
│   │   │   ├── routes/     # API routes
│   │   │   ├── rag/        # RAG client and logic
│   │   │   ├── db/         # Database repositories
│   │   │   └── lib/        # Utilities
│   │   └── prisma/         # Prisma schema and migrations
│   └── indexer/            # Content indexing service
│       ├── src/
│       │   ├── lib/        # Document processors
│       │   └── routes/     # Indexing API routes
└── frontend/               # React frontend
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── api/            # API client
    │   └── contexts/       # React contexts
```

## Resources

- **Architecture**: See `docs/ARCHITECTURE.md`
- **Configuration**: See `docs/CONFIG.md`
- **Fastify Docs**: https://www.fastify.io/
- **Prisma Docs**: https://www.prisma.io/docs/
- **Azure AI Search**: https://learn.microsoft.com/en-us/azure/search/

## Agent Behavior Rules

- **When implementing features**: Always check existing patterns in similar modules first
- **When debugging**: Check logs in Azure Portal (Application Insights) before adding console.logs
- **When optimizing**: Profile RAG queries - check retrieval quality and response time
- **When adding dependencies**: Check if shared packages already provide the functionality
- **When writing tests**: Include both happy path and error cases, especially for content processing

