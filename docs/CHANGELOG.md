# ApexCoachAI - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive issue tracking document (`docs/apexcoachai_issues.md`)
- Local development and demo guide (`docs/demo-guide.md`)
- Manual deployment guide (`docs/deployment-manual.md`)
- Complete configuration reference (`docs/CONFIG.md`)
- Added `DIRECT_URL` environment variable support for Prisma migrations
- JWT_SECRET configuration added to environment templates

### Changed

- **[SECURITY]** Removed hardcoded database password from `.env.example`
- Updated frontend Vite config production API URL to match actual deployment
- Standardized environment variable names across all services
- Updated all Dockerfiles to use consistent pnpm version (9.0.0)
- Fixed search backend Dockerfile to include proper build stage
- Fixed indexer Dockerfile CMD to use direct node execution
- Updated search backend package.json scripts to use pnpm instead of npm
- Aligned pnpm version across all package.json files

### Fixed

- Fixed double `await` in `apps/backend/search/src/routes/auth.ts` line 49
- Fixed typo in root `.env.example` (POSTGRESapexcoachai → POSTGRES_DATABASE)
- Corrected missing environment variables in indexer `.env.example`
- Fixed search backend `.env.example` to include all required variables

### Security

- Removed hardcoded credentials from all `.env.example` files
- Added warnings about secret management
- Documented JWT secret generation process
- Added security best practices section to CONFIG.md

## [1.0.0] - 2025-11-26

### Initial Release

- Full-stack AI coaching platform
- React frontend with TypeScript
- Fastify backend services (search API + indexer)
- PostgreSQL database with Prisma ORM
- Azure OpenAI integration for RAG
- Azure AI Search for vector search
- Azure Blob Storage for document storage
- User authentication and authorization
- Admin panel for content and user management
- Knowledge base document upload and indexing
- Interactive chat interface with AI coach
- Library of video content with transcripts
- Meta prompts (AI personalities) management
- White-label branding support
- Playwright end-to-end tests
- Docker and docker-compose support
- Turborepo monorepo structure with pnpm workspaces

---

## Issue Resolution Summary (2025-11-26)

### Resolved Issues

| Issue ID | Severity | Description                                 | Status          |
| -------- | -------- | ------------------------------------------- | --------------- |
| B003     | BLOCKER  | Hardcoded database password in .env.example | ✅ FIXED        |
| M006     | MAJOR    | Double await in auth.ts                     | ✅ FIXED        |
| B007     | BLOCKER  | Frontend API URL mismatch                   | ✅ FIXED        |
| B004     | BLOCKER  | Search Dockerfile missing build stage       | ✅ FIXED        |
| M008     | MAJOR    | Indexer Dockerfile CMD incorrect            | ✅ FIXED        |
| m004     | MINOR    | pnpm version mismatch                       | ✅ FIXED        |
| m006     | MINOR    | Search backend uses npm instead of pnpm     | ✅ FIXED        |
| B001     | BLOCKER  | Missing DIRECT_URL environment variable     | ✅ DOCUMENTED   |
| B005     | BLOCKER  | Environment variable naming inconsistency   | ✅ STANDARDIZED |
| m001     | MINOR    | README references non-existent CONFIG.md    | ✅ CREATED      |
| m002     | MINOR    | Deployment documentation missing            | ✅ CREATED      |

### Pending Issues

| Issue ID | Severity | Description                                         | Requires                    |
| -------- | -------- | --------------------------------------------------- | --------------------------- |
| B002     | BLOCKER  | Database migration workflow not documented          | Local testing + docs update |
| B006     | BLOCKER  | Health check endpoints need verification            | Code inspection + testing   |
| M001     | MAJOR    | Frontend TypeScript build config needs verification | Build testing               |
| M002     | MAJOR    | database.ts plugin dependencies need verification   | Code inspection             |
| M003     | MAJOR    | Need separate docker-compose.prod.yml               | Infrastructure decision     |
| M007     | MAJOR    | Azure Container Apps deployment manifests needed    | Infrastructure templates    |
| m003     | MINOR    | Frontend Dockerfile uses preview mode               | Production server decision  |
| m005     | MINOR    | .nvmrc not documented in README                     | Docs update                 |
| m008     | MINOR    | ingest-coaching-content.js not documented           | Script documentation        |

---

## Migration Guide

### From Development to Production

1. **Update environment variables**:
   - Copy from `.env.example` to production secrets
   - Generate new JWT_SECRET for production
   - Use production database credentials

2. **Build Docker images**:

   ```bash
   docker build -f apps/backend/search/Dockerfile -t apexcoachai-api:latest .
   docker build -f apps/backend/indexer/Dockerfile -t apexcoachai-indexer:latest .
   ```

3. **Deploy to Azure**:
   - Follow `docs/deployment-manual.md`

### From Old .env Format to New Format

**Old** (pre-2025-11-26):

```env
AZURE_OPENAI_SERVICE=shared-openai-eastus2
AZURE_OPENAI_CHATGPT_DEPLOYMENT=gpt-5.1-mini
AZURE_SEARCH_INDEX=apexcoachai-dev-index
AZURE_SEARCH_SERVICE=shared-search-standard-eastus2
AZURE_STORAGE_ACCOUNT=stmahumsharedapps
```

**New** (2025-11-26 onwards):

```env
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_INDEX_NAME=idx-apexcoachai-primary
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
```

---

## Contributors

- **Initial Development**: ApexCoachAI Team
- **DevOps & Infrastructure**: 2025-11-26 comprehensive audit and fixes

---

## Support

For issues, questions, or contributions:

- Review `docs/apexcoachai_issues.md` for known issues
- Check `docs/demo-guide.md` for local development help
- See `docs/CONFIG.md` for configuration reference
- Create GitHub issue for bugs or feature requests

---

**Note**: This changelog will be updated with each release. Breaking changes will be clearly marked.
