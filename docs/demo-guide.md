# ApexCoachAI - Local Development & Demo Guide

**Last Updated**: 2025-11-26  
**Target Audience**: Developers, QA, Product Demos

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Demo Flow](#demo-flow)
7. [Troubleshooting](#troubleshooting)
8. [Stopping and Cleanup](#stopping-and-cleanup)

---

## Prerequisites

### Required Software

| Tool | Minimum Version | Recommended | Check Command | Install Command |
|------|----------------|-------------|---------------|-----------------|
| **Node.js** | 20.0.0 | 22.x LTS | `node --version` | Download from [nodejs.org](https://nodejs.org/) or use nvm |
| **pnpm** | 8.0.0 | 9.0.0 | `pnpm --version` | `npm install -g pnpm@9.0.0` |
| **Git** | 2.x | Latest | `git --version` | Download from [git-scm.com](https://git-scm.com/) |
| **Docker** (optional) | 20.x | Latest | `docker --version` | Download from [docker.com](https://www.docker.com/) |

### Using Node Version Manager (nvm)

This project includes an `.nvmrc` file specifying Node.js 22:

```bash
# Install nvm if you don't have it: https://github.com/nvm-sh/nvm

# Install and use the correct Node version
nvm install
nvm use

# Verify
node --version  # Should show v22.x.x
```

### Required Azure Resources

You need access to the MahumTech shared Azure platform:

- **Azure Subscription**: `44e77ffe-2c39-4726-b6f0-2c733c7ffe78`
- **PostgreSQL**: `pg-shared-apps-eastus2` with database `apexcoachai`
- **Azure OpenAI**: `shared-openai-eastus2`
- **Azure AI Search**: `shared-search-standard-eastus2`
- **Azure Storage**: `stmahumsharedapps`

**Note**: Contact your team lead for credentials if you don't have access.

---

## Initial Setup

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/sh-fleekbiz/ApexCoachAI.git
cd ApexCoachAI

# Verify you're in the right directory
ls  # Should see: apps/, docs/, package.json, pnpm-workspace.yaml, etc.
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies (this may take 2-5 minutes)
pnpm install

# Verify installation
pnpm list --depth=0
```

**Expected Output**: You should see `frontend`, `search`, and `indexer` packages listed.

**If this fails**: See [Troubleshooting](#troubleshooting) section.

---

## Environment Configuration

### Understanding Environment Files

The application uses multiple `.env` files:

| File Location | Purpose |
|---------------|---------|
| `.env` (root) | Shared variables for local development |
| `apps/frontend/.env` | Frontend-specific variables |
| `apps/backend/search/.env` | Search API variables |
| `apps/backend/indexer/.env` | Indexer service variables |

### Step-by-Step Configuration

#### 1. Copy Environment Templates

```bash
# Root environment (shared vars)
cp .env.example .env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env

# Backend - Search API
cp apps/backend/search/.env.example apps/backend/search/.env

# Backend - Indexer
cp apps/backend/indexer/.env.example apps/backend/indexer/.env
```

#### 2. Configure Root .env

Open `.env` in your editor and set these **REQUIRED** values:

```env
# Azure OpenAI (get from Azure Portal or team lead)
AZURE_OPENAI_API_KEY=<your_azure_openai_key>

# PostgreSQL Database
DATABASE_URL=postgresql://<user>:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
DIRECT_URL=postgresql://<user>:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require

# Azure AI Search
AZURE_SEARCH_API_KEY=<your_search_api_key>

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=<your_storage_connection_string>

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=<generate_a_strong_random_string>
```

**Where to find these values:**

- **Azure Portal** → Resource Groups → `rg-shared-ai`, `rg-shared-data`
- **Azure OpenAI**: `shared-openai-eastus2` → Keys and Endpoint
- **Azure Search**: `shared-search-standard-eastus2` → Keys
- **Azure Storage**: `stmahumsharedapps` → Access keys
- **Database**: Contact DBA or check Azure Portal → `pg-shared-apps-eastus2` → Connection strings

#### 3. Configure Backend Services

Both `apps/backend/search/.env` and `apps/backend/indexer/.env` need the same Azure credentials:

```bash
# You can copy from root .env or set them directly
# They should match the root .env values for:
# - AZURE_OPENAI_*
# - AZURE_SEARCH_*
# - AZURE_STORAGE_*
# - DATABASE_URL (search backend only)
```

#### 4. Configure Frontend

Edit `apps/frontend/.env`:

```env
# For local development, API runs on port 3000
VITE_SEARCH_API_URI=http://localhost:3000
```

**Production Note**: For production builds, the frontend uses the hardcoded URL in `vite.config.ts` or the `BACKEND_URI` environment variable.

---

## Database Setup

### 1. Generate Prisma Client

```bash
cd apps/backend/search

# Generate TypeScript types and client from schema
pnpm prisma generate

# Verify it worked
ls node_modules/.prisma/client  # Should exist

cd ../../..  # Back to root
```

### 2. Run Database Migrations

**IMPORTANT**: This creates tables in the shared PostgreSQL database.

```bash
cd apps/backend/search

# Run migrations (creates/updates tables)
pnpm prisma migrate dev

# You'll be prompted to name the migration
# Suggestion: "init" or "initial_schema"

cd ../../..
```

**What this does:**
- Connects to PostgreSQL using `DATABASE_URL` from `.env`
- Creates all tables defined in `prisma/schema.prisma`
- Records migration history in `_prisma_migrations` table

### 3. Seed Default Data (Optional but Recommended)

```bash
cd apps/backend/search

# If seed script exists:
pnpm seed:demo

# Or manually create admin user via the app after first launch
```

**Seed script should create:**
- Default admin user (email: `admin@apexcoachai.com`)
- Default meta prompts (coaching personalities)
- Sample knowledge base documents (if available)

**If seed script doesn't exist**: You'll need to sign up manually and promote your user to admin role in the database.

---

## Running the Application

### Option 1: Run All Services (Recommended)

```bash
# From repository root
pnpm dev

# This starts:
# - Frontend (http://localhost:5173)
# - Search API (http://localhost:3000)
# - Indexer (http://localhost:3001)
```

**Expected Output:**
```
> apex-coach-ai@ dev /path/to/ApexCoachAI
> turbo dev

frontend:dev: VITE v6.1.0  ready in 352 ms
frontend:dev: ➜  Local:   http://localhost:5173/
search:dev: [TypeScript] Watching for file changes...
search:dev: [App] Server listening at http://0.0.0.0:3000
indexer:dev: [TypeScript] Watching for file changes...
indexer:dev: [App] Server listening at http://0.0.0.0:3001
```

### Option 2: Run Services Individually

**Useful for debugging a specific service:**

```bash
# Terminal 1: Search API
pnpm dev --filter=search

# Terminal 2: Indexer
pnpm dev --filter=indexer

# Terminal 3: Frontend
pnpm dev --filter=frontend
```

### Option 3: Using Docker Compose (Alternative)

```bash
# From repository root
cd infra/docker
docker-compose up

# Or with rebuild:
docker-compose up --build
```

**Note**: Docker compose is configured for development with volume mounts for hot reload.

---

## Demo Flow

Once all services are running, follow this flow to demonstrate the application:

### 1. Access the Application

Open your browser to: **http://localhost:5173**

You should see the ApexCoachAI landing/login page.

### 2. Create an Account

1. Click "Sign Up" (or navigate to `http://localhost:5173/#/signup`)
2. Enter:
   - Email: `demo@example.com`
   - Password: `demo123456` (min 8 chars)
   - Name: `Demo User`
3. Click "Sign Up"
4. You'll be redirected to the main chat interface

### 3. Test Chat Interface

1. You should see the chat input box
2. Type a question: `"What is coaching?"`
3. Press Enter or click Send
4. **Expected behavior:**
   - Message appears in chat
   - Loading indicator shows
   - AI response streams in
   - Citations appear below response (if knowledge base has content)

**If chat doesn't work**: Check:
- Search API is running on port 3000
- Browser console for errors (F12 → Console tab)
- Network tab shows request to `/api/chat` endpoint
- Backend logs for error messages

### 4. Test Library (Video Content)

1. Click "Library" in the sidebar
2. You should see a list of video resources (if seeded)
3. Click on a video to view transcript
4. Test search/filter functionality

### 5. Test Settings

1. Click "Settings" in sidebar or profile menu
2. Update user profile:
   - Nickname
   - Occupation
   - Default personality/meta prompt
3. Save changes
4. Verify settings persist on page reload

### 6. Test Admin Panel (If Admin User)

**Note**: You need admin role in database to access this.

1. Navigate to `http://localhost:5173/#/admin`
2. Explore admin sections:
   - **Analytics**: Usage statistics
   - **People**: User management
   - **Programs**: Coaching programs
   - **Knowledge Base**: Document management
   - **Meta Prompts**: AI personality management
   - **White Label**: Branding settings

### 7. Test Knowledge Base Upload

1. Go to Admin → Knowledge Base
2. Click "Upload Document"
3. Select a PDF, DOCX, or TXT file
4. Fill in metadata (title, program assignment)
5. Upload
6. Verify status changes: `pending` → `indexed`
7. Go back to chat and ask questions about the document content

### 8. Test Document Indexing

1. In Knowledge Base, select an indexed document
2. Click "Retrain" or re-index
3. Monitor status changes
4. Check indexer logs (terminal running indexer) for processing output

---

## Troubleshooting

### Issue: pnpm install fails

**Symptoms:**
```
ERROR  Failed to resolve dependencies
```

**Solutions:**
1. Clear pnpm cache:
   ```bash
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

2. Verify pnpm version:
   ```bash
   pnpm --version  # Should be 8.x or 9.x
   npm install -g pnpm@9.0.0
   ```

3. Check Node.js version:
   ```bash
   node --version  # Should be 20.x or 22.x
   nvm use 22
   ```

### Issue: Database connection fails

**Symptoms:**
```
Error: P1001: Can't reach database server at `pg-shared-apps-eastus2.postgres.database.azure.com`
```

**Solutions:**
1. Verify `DATABASE_URL` in `.env`:
   - Check username and password are correct
   - Ensure `sslmode=require` is present
   - Confirm database name is `apexcoachai`

2. Test connection manually:
   ```bash
   # Using psql (if installed)
   psql "postgresql://user:pass@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require"
   ```

3. Check firewall rules:
   - Azure PostgreSQL may require your IP in firewall rules
   - Contact DBA to add your IP to allowlist

4. Verify `DIRECT_URL` is also set (required for migrations)

### Issue: Prisma migrate fails

**Symptoms:**
```
Error: Environment variable not found: DIRECT_URL
```

**Solution:**
Add `DIRECT_URL` to your `.env`:
```env
DIRECT_URL=postgresql://user:pass@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai?sslmode=require
```

### Issue: Frontend can't connect to API

**Symptoms:**
- Chat doesn't respond
- Network errors in browser console
- CORS errors

**Solutions:**
1. Verify search API is running:
   ```bash
   curl http://localhost:3000/health
   # or
   curl http://localhost:3000/
   ```

2. Check `VITE_SEARCH_API_URI` in `apps/frontend/.env`:
   ```env
   VITE_SEARCH_API_URI=http://localhost:3000
   ```

3. Verify vite proxy config in `apps/frontend/vite.config.ts` (lines 37-50)

4. Check CORS settings in `apps/backend/search/src/app.ts`

### Issue: Azure OpenAI errors

**Symptoms:**
```
Error: 401 Unauthorized
Error: The API deployment for this resource does not exist
```

**Solutions:**
1. Verify `AZURE_OPENAI_API_KEY` is set correctly

2. Check deployment names match:
   - In Azure Portal: `shared-openai-eastus2` → Deployments
   - Should see: `gpt-4o`, `text-embedding-3-small`

3. Update `.env` if deployment names are different:
   ```env
   AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
   AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-3-small
   ```

4. Verify API version is current:
   ```env
   AZURE_OPENAI_API_VERSION=2025-01-01-preview
   ```

### Issue: Port already in use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F

   # Mac/Linux
   lsof -i :3000
   kill -9 <PID>
   ```

2. Or use different ports:
   ```bash
   # In apps/backend/search/.env
   PORT=3100

   # In apps/frontend/.env
   VITE_SEARCH_API_URI=http://localhost:3100
   ```

### Issue: TypeScript build errors

**Symptoms:**
```
error TS2307: Cannot find module 'X' or its corresponding type declarations
```

**Solutions:**
1. Regenerate Prisma client:
   ```bash
   cd apps/backend/search
   pnpm prisma generate
   ```

2. Clean and rebuild:
   ```bash
   pnpm run clean  # If script exists
   rm -rf apps/*/dist
   pnpm build
   ```

3. Check tsconfig.json paths and references

---

## Stopping and Cleanup

### Gracefully Stop Services

If running with `pnpm dev`:
- Press `Ctrl+C` in the terminal
- Wait for all processes to exit

If running individually:
- Press `Ctrl+C` in each terminal

If running with Docker Compose:
```bash
docker-compose down

# To also remove volumes:
docker-compose down -v
```

### Clean Build Artifacts

```bash
# Clean all build outputs
rm -rf apps/frontend/dist
rm -rf apps/backend/search/dist
rm -rf apps/backend/indexer/dist

# Or use turbo clean (if available)
pnpm run clean
```

### Reset Database (Caution!)

**WARNING**: This will delete all data.

```bash
cd apps/backend/search

# Reset database (drops and recreates)
pnpm prisma migrate reset

# You'll need to re-seed after this
```

---

## Quick Reference

### Service URLs (Local)

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React UI |
| Search API | http://localhost:3000 | Main backend API |
| API Docs (Swagger) | http://localhost:3000/docs | OpenAPI documentation |
| Indexer API | http://localhost:3001 | Document indexing service |

### Key Commands

```bash
# Install dependencies
pnpm install

# Development (all services)
pnpm dev

# Development (specific service)
pnpm dev --filter=frontend
pnpm dev --filter=search
pnpm dev --filter=indexer

# Build (all)
pnpm build

# Build (specific)
pnpm build --filter=frontend

# Tests
pnpm test
pnpm test:e2e

# Linting
pnpm lint

# Database
cd apps/backend/search
pnpm prisma generate      # Generate client
pnpm prisma migrate dev   # Run migrations
pnpm prisma studio        # Open GUI
```

### Environment Variables Quick Reference

See `docs/CONFIG.md` (to be created) for comprehensive list.

**Minimum required:**
- `DATABASE_URL` + `DIRECT_URL`
- `AZURE_OPENAI_API_KEY`
- `AZURE_SEARCH_API_KEY`
- `AZURE_STORAGE_CONNECTION_STRING`
- `JWT_SECRET`

---

## Next Steps

1. **For Development**: 
   - Review `docs/apexcoachai_issues.md` for known issues
   - Check `.github/copilot-instructions.md` for coding standards

2. **For Deployment**:
   - See `docs/deployment-manual.md` for production deployment guide

3. **For Testing**:
   - Run `pnpm test:e2e` for end-to-end tests
   - Review test coverage with `pnpm test`

4. **For Contributing**:
   - Read `AGENTS.md` for AI agent guidelines
   - Follow conventional commits for git messages

---

**Questions or Issues?**
- Check `docs/apexcoachai_issues.md`
- Review troubleshooting section above
- Contact team lead or create GitHub issue
