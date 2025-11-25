# Local Testing Guide - Apex Coach AI

## Prerequisites

- Node.js 22.x or higher
- pnpm 9.0.0 or higher
- Docker Desktop (for containerized testing)
- Azure CLI (for deployment)
- Azure account with appropriate subscriptions

## Environment Setup

### 1. Create Local Environment File

Create `.env.local` in the project root:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.cognitiveservices.azure.com/
AZURE_OPENAI_KEY=<your-key-here>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT=text-embedding-3-small

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net
AZURE_SEARCH_API_KEY=<your-key-here>
AZURE_SEARCH_INDEX_PREFIX=apexcoachai

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=<your-connection-string>
AZURE_STORAGE_ACCOUNT=stmahumsharedapps
AZURE_STORAGE_CONTAINER_PREFIX=apexcoachai

# PostgreSQL Database
SHARED_PG_CONNECTION_STRING=postgresql://username:password@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require

# Backend Configuration
BACKEND_URI=http://localhost:3000
NODE_ENV=development

# Frontend Configuration
VITE_SEARCH_API_URI=http://localhost:3000
```

**IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Build All Packages

```bash
pnpm build
```

## Testing Locally (Without Docker)

### Start Backend Services

Open three terminal windows:

#### Terminal 1: Search API (Port 3000)

```bash
cd apps/backend/search
pnpm dev
```

The search API will be available at http://localhost:3000

- Swagger UI: http://localhost:3000/swagger

#### Terminal 2: Indexer API (Port 3001)

```bash
cd apps/backend/indexer
pnpm dev
```

The indexer API will be available at http://localhost:3001

- Swagger UI: http://localhost:3001/swagger

#### Terminal 3: Frontend (Port 5173)

```bash
cd apps/frontend
pnpm dev
```

The frontend will be available at http://localhost:5173

### Testing the Services

1. **Health Checks**:

   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001/health
   ```

2. **Test Search API**:

   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages": [{"role": "user", "content": "Hello"}]}'
   ```

3. **Test Indexer**:

   ```bash
   curl http://localhost:3001/api/status
   ```

4. **Test Frontend**:
   - Open http://localhost:5173 in your browser
   - Navigate through the app
   - Test the chat functionality

## Testing with Docker Compose

### Build and Start All Services

```bash
cd infra/docker
docker-compose up --build
```

Services will be available at:

- Frontend: http://localhost:5173
- Search API: http://localhost:3000
- Indexer API: http://localhost:3001
- UI Component: http://localhost:8000

### Stop Services

```bash
cd infra/docker
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f search
docker-compose logs -f indexer
docker-compose logs -f frontend
```

## Troubleshooting Common Issues

### Build Failures

**Issue**: TypeScript errors during build

```bash
# Clean all build artifacts
pnpm -r exec rimraf dist
pnpm build
```

### Database Connection Issues

**Issue**: Can't connect to PostgreSQL

1. Verify connection string in `.env.local`
2. Check if database exists:
   ```bash
   psql $SHARED_PG_CONNECTION_STRING -c "\l"
   ```
3. Check if you need to run migrations:
   ```bash
   cd apps/backend/search
   npx prisma migrate deploy
   ```

### Azure Service Connection Issues

**Issue**: Can't connect to Azure OpenAI or Search

1. Verify your credentials are correct
2. Check if your IP is allowed in Azure firewalls
3. Test connection with Azure CLI:
   ```bash
   az login
   az cognitiveservices account keys list \
     --name shared-openai-eastus2 \
     --resource-group rg-shared-ai
   ```

### Port Already in Use

**Issue**: Port 3000, 3001, or 5173 is already in use

```bash
# Find and kill process (Windows)
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Find and kill process (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Docker Issues

**Issue**: Docker build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
cd infra/docker
docker-compose build --no-cache
```

## Running Tests

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter search test
pnpm --filter indexer test
pnpm --filter frontend test
```

### E2E Tests

```bash
# Ensure services are running first
pnpm playwright test

# Run with UI
pnpm playwright test --ui

# Run specific test file
pnpm playwright test tests/e2e/webapp.spec.ts
```

### Load Tests

```bash
cd tests/load
npm install
npm test
```

## Pre-Deployment Checklist

Before deploying to Azure, verify:

- [ ] All builds pass: `pnpm build`
- [ ] All tests pass: `pnpm test`
- [ ] Docker images build successfully: `cd infra/docker && docker-compose build`
- [ ] Services start without errors locally
- [ ] Frontend connects to backend APIs
- [ ] Database migrations are ready: `npx prisma migrate diff`
- [ ] Environment variables are documented
- [ ] Secrets are stored in Azure Key Vault (not in code)
- [ ] `.env.local` is in `.gitignore` and not committed

## Next Steps: Deployment

Once local testing is complete, proceed with Azure deployment:

```bash
# Login to Azure
az login

# Deploy with Azure Developer CLI
azd up
```

For detailed deployment instructions, see [Azure Deployment Guide](./docs/DEPLOYMENT.md).

## Monitoring and Debugging

### Application Insights

If configured, view logs in Azure Portal:

1. Navigate to Application Insights resource
2. Go to "Logs" or "Live Metrics"
3. Query for errors or performance issues

### Local Debugging

#### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Search API",
      "cwd": "${workspaceFolder}/apps/backend/search",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Indexer",
      "cwd": "${workspaceFolder}/apps/backend/indexer",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Additional Resources

- [Project Architecture](./docs/ARCHITECTURE.md)
- [Secrets Management](./SECRETS_MANAGEMENT.md)
- [API Documentation](./docs/README.md)
- [Azure Configuration](./docs/CONFIG.md)

---

**Last Updated**: 2024-11-24
**Maintained By**: Apex Coach AI Team
