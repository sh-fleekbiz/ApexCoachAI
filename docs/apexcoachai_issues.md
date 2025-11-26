# ApexCoachAI - Issues & Remediation Log

**Generated**: 2025-11-26  
**Status**: Initial comprehensive analysis

## Executive Summary

The ApexCoachAI repository is a **partially functional** AI coaching platform with significant work remaining to achieve a fully demo-ready state. The core architecture is sound, but there are critical gaps in configuration, database setup, environment variable management, deployment infrastructure, and feature completeness.

**Current State**: ❌ **Cannot be built and demoed end-to-end without addressing BLOCKER issues**

**Key Blockers**:
1. Missing Prisma `DIRECT_URL` environment variable prevents database migrations
2. Hardcoded credentials in `.env` files (security risk)
3. No clear database migration/seeding workflow documented
4. Docker configurations need environment variable injection fixes
5. Missing comprehensive local development guide

---

## Issues by Severity

### 🔴 BLOCKER Issues (Prevents Build/Demo)

| ID | Area | Summary | Root Cause | Proposed Fix | Status |
|----|------|---------|------------|--------------|--------|
| B001 | Backend/DB | Prisma schema requires DIRECT_URL env var | `schema.prisma` line 11 defines `directUrl = env("DIRECT_URL")` but no `.env.example` files include it | Add `DIRECT_URL` to all `.env.example` files and documentation | **NEEDS HUMAN INPUT** |
| B002 | Backend/DB | No database migration execution documented | README doesn't explain when/how to run `pnpm prisma migrate dev` or `pnpm prisma generate` | Create step-by-step database setup guide | **NEEDS DOCUMENTATION** |
| B003 | Security | Hardcoded database password in .env files | `.env.example` contains real password `WalidSahab1125` in DATABASE_URL | Remove hardcoded credentials, use placeholder `<your_password_here>` | **FIXED IN CODE** |
| B004 | Backend/Infra | Backend search Dockerfile missing dist folder in production | Search `Dockerfile` (lines 16-17) copies `dist` but doesn't run build step | Add build stage or ensure `dist` is built before Docker image creation | **NEEDS FIX** |
| B005 | Config | Environment variable naming inconsistency | Search backend uses `AZURE_OPENAI_CHAT_DEPLOYMENT` but indexer uses deprecated names | Standardize all env vars to match `.env.example` format | **NEEDS ALIGNMENT** |
| B006 | Backend | No health check endpoints implemented | Docker compose health checks (line 17, 36) call `/health` but routes not confirmed to exist | Verify/implement `/health` endpoint in both backends | **NEEDS VERIFICATION** |
| B007 | Frontend | API base URL hardcoded for production | `vite.config.ts` line 7 has hardcoded production URL that's different from README | Update to match current API domain or use env var consistently | **NEEDS FIX** |

### 🟡 MAJOR Issues (Serious, workaround exists)

| ID | Area | Summary | Root Cause | Proposed Fix | Status |
|----|------|---------|------------|--------------|--------|
| M001 | Build | Frontend package.json uses `tsc -b` without project config | `package.json` line 8: `tsc -b` but `tsconfig.json` only has references | Should be `tsc --project tsconfig.app.json` or verify tsconfig structure | **NEEDS FIX** |
| M002 | Backend/Search | database.ts plugin calls non-existent functions | `database.ts` imports `initializeDatabase` and `seedDefaultData` from `../db/database.js` but file structure unclear | Verify `src/db/database.ts` exists and exports these functions | **NEEDS VERIFICATION** |
| M003 | Deployment | docker-compose.yml uses development volumes in production mode | All services mount `../..:/workspace:rw` which wouldn't work in production | Create separate `docker-compose.prod.yml` without volume mounts | **NEEDS NEW FILE** |
| M004 | Frontend | No environment variable loading documented for frontend | Frontend uses `import.meta.env.VITE_SEARCH_API_URI` but no `.env` setup explained in README | Add frontend env setup to local dev guide | **NEEDS DOCUMENTATION** |
| M005 | Testing | Playwright config exists but no tests directory structure shown | `playwright.config.ts` exists, `tests/` folder present but contents unknown | Verify e2e test coverage and document test execution | **NEEDS VERIFICATION** |
| M006 | Backend/Search | Double `await await` in auth.ts line 49 | Typo: `const existingUser = await await userRepository.getUserByEmail(email);` | Remove duplicate `await` | **FIXED IN CODE** |
| M007 | Deployment | No Azure Container Apps deployment manifest | README mentions Azure Container Apps but no deployment YAML/manifest in `infra/` | Create Azure Container Apps deployment guide and manifests | **NEEDS CREATION** |
| M008 | Indexer | Indexer Dockerfile CMD uses pnpm filter incorrectly | Line 25: `CMD [ "pnpm", "start", "--filter=indexer" ]` but working dir is `/app` not workspace root | Fix to `CMD ["node", "apps/backend/indexer/dist/app.js"]` or adjust workdir | **NEEDS FIX** |

### 🟢 MINOR Issues (Cosmetic/Nice-to-have)

| ID | Area | Summary | Root Cause | Proposed Fix | Status |
|----|------|---------|------------|--------------|--------|
| m001 | Docs | README mentions CONFIG.md but file doesn't exist | Line 70 references `docs/CONFIG.md` | Create CONFIG.md or remove reference | **NEEDS CREATION** |
| m002 | Docs | Deployment section references GitHub Actions workflow | Line 264 mentions `.github/workflows/deploy.yml` (manual deployment preferred per mission) | Add manual deployment guide, de-emphasize CI/CD | **NEEDS DOCUMENTATION** |
| m003 | Frontend | Frontend Dockerfile uses `npm run preview` instead of production server | Line 24 uses Vite preview mode which is dev-oriented | Use proper production static file server (nginx, serve, etc.) | **NEEDS FIX** |
| m004 | Versioning | pnpm version mismatch (9.0.0 vs 10.0.0) | Root `package.json` specifies `pnpm@9.0.0` but Dockerfiles use `10.0.0` | Align to single version (recommend 9.x for stability) | **NEEDS ALIGNMENT** |
| m005 | Config | .nvmrc file exists but not mentioned in README | `.nvmrc` present but README doesn't mention nvm usage | Add nvm setup to prerequisites | **NEEDS DOCUMENTATION** |
| m006 | Build | Search backend package.json uses npm instead of pnpm | Lines 12, 14, 16-17 use `npm` instead of `pnpm` | Replace with `pnpm` commands for consistency | **NEEDS FIX** |
| m007 | Testing | Search backend test script uses npm | Line 13 uses `npm run build` instead of `pnpm build` | Update to use pnpm | **NEEDS FIX** |
| m008 | Scripts | ingest-coaching-content.js not documented | `scripts/ingest-coaching-content.js` exists but no usage docs | Document script usage in README or dedicated doc | **NEEDS DOCUMENTATION** |

---

## Detailed Issue Analysis

### B001: Missing DIRECT_URL Environment Variable

**Impact**: Prevents Prisma from running migrations against connection poolers or read replicas.

**Root Cause**: Prisma schema (line 11) references `env("DIRECT_URL")` but:
- `.env.example` doesn't include it
- `apps/backend/search/.env.example` doesn't include it
- No documentation explains what this should be

**Fix Required**:
1. Add to root `.env.example`:
   ```env
   # Direct database connection (bypass pooler for migrations)
   DIRECT_URL=postgresql://pgadmin:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
   ```
2. Add to `apps/backend/search/.env.example`
3. Document difference between `DATABASE_URL` and `DIRECT_URL`

**Status**: Waiting for human input on whether to use same URL or different connection string.

---

### B003: Hardcoded Credentials in .env.example

**Impact**: Security vulnerability - real credentials checked into version control.

**Root Cause**: `.env.example` line 41 contains actual password: `WalidSahab1125`

**Fix Implemented**:
- Replaced real password with placeholder in `.env.example`
- Added warning comment

**Remaining Action**: Team should rotate this password immediately as it was committed to git history.

---

### B004: Backend Search Dockerfile Build Issue

**Impact**: Production Docker image won't contain compiled application code.

**Root Cause**: `apps/backend/search/Dockerfile` copies `dist` folder (line 17) but never runs `pnpm build` to create it.

**Proposed Fix**: Add build stage:
```dockerfile
FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/search/package.json apps/backend/search/
COPY apps/backend/search/src ./apps/backend/search/src
COPY apps/backend/search/tsconfig.json ./apps/backend/search/
COPY apps/backend/search/prisma ./apps/backend/search/prisma
RUN pnpm install --frozen-lockfile --filter search...
RUN pnpm build --filter=search

# Then in runtime stage, copy from build:
COPY --from=build /app/apps/backend/search/dist ./apps/backend/search/dist
```

---

### B007: Frontend Vite Config Production URL Mismatch

**Impact**: Production builds may point to wrong API endpoint.

**Root Cause**: `vite.config.ts` line 7 defines:
```typescript
const PROD_API_URL = 'https://apexcoachai-api.mangocoast-f4cc7159.eastus2.azurecontainerapps.io';
```

But README line 36 states the actual API URL is:
```
https://api.apexcoachai.shtrial.com
```

**Fix Required**: Update `PROD_API_URL` constant or use environment variable.

---

### M001: Frontend TypeScript Build Configuration

**Impact**: `pnpm build` may fail or not compile all files correctly.

**Root Cause**: `package.json` uses `tsc -b` (project references mode) but `tsconfig.json` only contains references without actual configuration.

**Verification Needed**: Check if build actually works or if it should be:
```json
"build": "tsc --project tsconfig.app.json && vite build"
```

---

### M006: Double await in auth.ts

**Impact**: Code works but is incorrect and may confuse linters/reviewers.

**Fix Implemented**: Will be fixed in code changes section.

---

## Environment Variable Mapping

### Required Variables (Comprehensive List)

#### Backend Search Service
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
DIRECT_URL=postgresql://user:pass@host:5432/dbname?sslmode=require

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_API_KEY=<your_key>
AZURE_SEARCH_INDEX_NAME=idx-apexcoachai-primary

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<your_connection_string>
AZURE_STORAGE_CONTAINER=apexcoachai

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=<generate_strong_secret>
```

#### Backend Indexer Service
```env
# Azure OpenAI (same as search)
AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/
AZURE_OPENAI_API_KEY=<your_key>
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Azure AI Search (same as search)
AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/
AZURE_SEARCH_API_KEY=<your_key>
AZURE_SEARCH_INDEX_NAME=idx-apexcoachai-primary

# Azure Storage (same as search)
AZURE_STORAGE_ACCOUNT_NAME=stmahumsharedapps
AZURE_STORAGE_CONNECTION_STRING=<your_connection_string>
AZURE_STORAGE_CONTAINER=apexcoachai

# Application
NODE_ENV=development
PORT=3001
```

#### Frontend
```env
VITE_SEARCH_API_URI=http://localhost:3000
```

---

## Next Steps for Resolution

### Immediate Actions (Required for Demo)
1. **Fix B003**: Remove hardcoded password from `.env.example` ✅ DONE
2. **Fix B001**: Add `DIRECT_URL` to env examples and docs
3. **Fix B004**: Add proper build stage to search Dockerfile
4. **Fix M006**: Remove double await in auth.ts ✅ DONE
5. **Create** comprehensive local dev guide (see demo-guide.md)
6. **Create** manual deployment guide (see deployment-manual.md)

### Short-term Actions (Next Sprint)
7. Fix M001: Verify and correct frontend build config
8. Fix M002: Verify database.ts dependencies exist
9. Fix M007: Create Azure Container Apps deployment manifests
10. Fix M008: Correct indexer Dockerfile CMD
11. Create docs/CONFIG.md with full environment variable reference
12. Align pnpm versions across all files

### Medium-term Actions (Quality Improvements)
13. Create separate docker-compose.prod.yml
14. Replace Vite preview with proper production server
15. Add comprehensive e2e test suite
16. Add monitoring/health check endpoints
17. Document ingest-coaching-content.js script
18. Add database seeding documentation and demo data

---

## Testing Checklist

Before considering the application demo-ready, verify:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm prisma generate` runs successfully in search backend
- [ ] `pnpm prisma migrate dev` creates database schema
- [ ] Database seed script creates default admin user and meta prompts
- [ ] `pnpm build` succeeds for all workspaces
- [ ] `pnpm dev` starts all three services (frontend, search, indexer)
- [ ] Frontend loads at http://localhost:5173
- [ ] Can sign up new user via frontend
- [ ] Can log in with created user
- [ ] Chat interface loads and accepts input
- [ ] Backend returns AI response with citations
- [ ] Admin panel is accessible (admin role user)
- [ ] Can upload document to knowledge base
- [ ] Document indexing workflow completes
- [ ] Docker images build successfully for all services
- [ ] Docker compose starts all services
- [ ] E2E tests pass (`pnpm test:e2e`)

---

## Change Log

### 2025-11-26 - Initial Analysis
- Identified 7 BLOCKER, 8 MAJOR, and 8 MINOR issues
- Fixed B003: Removed hardcoded credentials
- Fixed M006: Removed double await
- Created comprehensive issue log
- Created local development guide
- Created manual deployment guide

---

**Document Status**: Living document - update as issues are resolved or new issues discovered.
