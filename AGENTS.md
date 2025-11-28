# AGENTS – Global Rules for ApexCoachAI

**API Standard:** Azure OpenAI Responses API (Stateful v1)

This repo uses shared Azure infrastructure and the **Azure OpenAI Responses API**.

## 🛑 HARD RULES (DO NOT BREAK)

1. **NO NEW INFRA:** Do not create Resource Groups, Storage Accounts, or Postgres Servers.
2. **NO AZURE SEARCH:** Use `pgvector` on the shared Postgres database.
3. **NO CI/CD:** Do not touch GitHub Actions or Azure Pipelines.
4. **USE RESPONSES API:** Use `gpt-5.1-codex-mini` via the `/openai/v1/responses` endpoint. Do not use legacy Chat Completions.
5. **USE STATEFUL API:** 
   - Use `input` field for queries.
   - Use `previous_response_id` for conversation history.
   - **Do not** send full message history arrays.
6. **NO FRONTEND KEYS:** Never expose `AZURE_OPENAI_API_KEY` to client-side code.

## 🚫 REPOSITORY CLEANLINESS RULES (NEVER VIOLATE)

### Forbidden Folders & Files
- **NEVER** create: `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/`
- **NEVER** create nested `README.md` files that just describe folder purpose
- **NEVER** create `.github/instructions/` - AI prompts belong in external wikis
- **NEVER** create duplicate configuration files

### Forbidden Code Patterns
- **NEVER** commit commented-out code blocks
- **NEVER** add `console.log` statements in production code
- **NEVER** leave TODO comments older than 2 weeks
- **NEVER** commit experimental/POC/spike code to main repo
- **NEVER** commit files larger than 500KB without explicit approval

### Documentation Rules
- **NEVER** create new documentation files - update existing ones
- **ALWAYS** update `DEPLOYMENT_GUIDE.md` for deployment changes
- **ALWAYS** document new environment variables in `.env.example`

## ✅ REQUIRED PATTERNS

### Canonical Structure
```
apps/web/src/          # Frontend (React/Vite)
├── components/        # Reusable UI components
├── features/          # Feature-based organization
├── pages/             # Route components
├── hooks/             # Custom React hooks
├── services/          # API clients
├── contexts/          # React contexts/state
└── types/             # TypeScript types

apps/services/         # Backend services
├── indexer/          # Document indexing service
└── search/           # AI search service
```

### Naming Conventions
- **Components**: PascalCase (`PersonalityCard.tsx`)
- **Files**: kebab-case (`chat-service.ts`)
- **Folders**: kebab-case for features, PascalCase for domains

### Dependency Management
- **Use approved whitelist only** - see REPOSITORY_STRUCTURE.md
- **Audit dependencies** before adding new ones
- **Remove unused dependencies** immediately

## 📋 AI AGENT WORKFLOW

### Before Generating Code
1. Check if code belongs in canonical structure
2. Verify dependencies are approved
3. Identify which existing docs need updates

### After Generating Code
1. Delete at least as much code as you add
2. Remove console.log, commented code, old TODOs
3. Update existing single-source-of-truth docs
4. Document new environment variables in `.env.example`

## 🚨 ENFORCEMENT

- **GitHub Actions** auto-reject forbidden patterns
- **PR template** requires cleanup checklist
- **Code review** validates compliance
- **Automated scans** check for anti-patterns

---

**AI ASSISTANTS MUST FOLLOW THESE RULES EXACTLY**  
**VIOLATIONS WILL CAUSE AUTOMATED REJECTION**

## 🏗️ Shared Architecture

* **Database:** Shared Postgres (`apexcoachai` database on `pg-shared-apps-eastus2`)
* **Storage:** Shared Storage (`apexcoachai` container in `stmahumsharedapps`)
* **Model:** `gpt-5.1-codex-mini` (Logic/Chat/Code)
* **Image:** `gpt-image-1-mini`
* **Embeddings:** `text-embedding-3-small`
* **Audio:** `gpt-audio-mini`

## 🛠️ Implementation Guide

1. **Embeddings:** Use `text-embedding-3-small` endpoint to generate vector.
2. **Storage:** Store vector in `apexcoachai` database using `pgvector`.
3. **Retrieval:** Query database using cosine distance (`<=>`).
4. **Generation:** Pass retrieved context to `gpt-5.1-codex-mini` via Responses API.

## 📡 API Usage Specs

* **Endpoint:** `/openai/v1/responses` (v1 GA, no api-version query param)
* **Request Format:** Use `input` field (string or array), NOT `messages` array
* **State Management:** Use `previous_response_id` for conversation continuity
* **Auth Header:** `api-key: {AZURE_OPENAI_API_KEY}` (not Bearer token)
* **Token Parameter:** `max_output_tokens` (not `max_completion_tokens` or `max_tokens`)
* **Structured Outputs:** Support `response_format` for JSON mode

### Example Request

```json
{
  "model": "gpt-5.1-codex-mini",
  "input": "User's new question",
  "previous_response_id": "resp_123456"
}
```

### Example Response Handling

* Look for `output` array in the JSON response.
* Store `id` (e.g., `resp_xyz`) to pass in the next request.

## 🏗️ Shared Infrastructure (Read-Only)

* **PostgreSQL:** `pg-shared-apps-eastus2` (database: `apexcoachai`)
* **Storage:** `stmahumsharedapps` (container: `apexcoachai`)
* **OpenAI:** `shared-openai-eastus2`
* **DNS:** `apexcoachai.shtrial.com` (frontend), `api.apexcoachai.shtrial.com` (backend)
* **Registry:** `acrsharedapps`
