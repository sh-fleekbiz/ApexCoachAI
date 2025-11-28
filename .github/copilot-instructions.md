# Copilot Instructions - ApexCoachAI

## Project Overview
- **Application**: AI Coaching Platform
- **URL**: https://apexcoachai.shtrial.com
- **API Base URL**: https://api.apexcoachai.shtrial.com
- **API Docs**: https://api.apexcoachai.shtrial.com/docs

## Development Guidelines

### Testing
- Use `pnpm test:e2e` to run Playwright E2E tests
- `pretest:e2e` automatically installs browsers
- Always use pnpm, never npm or yarn

### Infrastructure Rules
- Do NOT create new Azure resource groups
- Reuse shared resource groups (rg-shared-ai, rg-shared-data, rg-shared-apps, rg-shared-web, rg-shared-logs)
- Use shared Postgres server (pg-shared-apps-eastus2) with database named "apexcoachai"
- Use shared storage account with container named "apexcoachai"
- Use shared Azure OpenAI. Semantic search / RAG must use Postgres + pgvector (Azure AI Search is not used).