# AGENTS – Global Rules for ApexCoachAI

**API Standard:** Azure OpenAI Responses API (Stateful v1)

This repo uses shared Azure infrastructure and the **Azure OpenAI Responses API**.

## ⚡ Quick Reference (Read First)

- **Infra & Azure**
  - No new Azure infra (no new resource groups, storage, Postgres, search).
  - Use **Responses API** (`/openai/v1/responses`) with `input` + `previous_response_id`.
  - Never expose `AZURE_OPENAI_API_KEY` to client-side code.

- **Repo Hygiene**
  - No `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/` folders.
  - No commented-out code, debug `console.log` in production, or stale TODOs.
  - No new docs files; always update existing single sources of truth.

- **Structure & Naming**
  - Frontend in `apps/web/src` using `components/`, `features/`, `pages/`, `services/`, etc.
  - Backend in `apps/services/*` (e.g. `search`, `indexer`).
  - Components = PascalCase, files = kebab-case, features = kebab-case folders.

- **Dependencies & Tooling**
  - Use only approved dependencies (see `REPOSITORY_STRUCTURE.md`).
  - Remove unused deps; avoid tooling bloat.
  - No Turborepo or new CI/CD workflows; prefer simple root `pnpm`/`npm` scripts.

- **Cleanup & Refactors**
  - Prefer deleting low-value code over archiving.
  - Classify changes as P1/P2/P3 and follow phased cleanup (quick wins → structure → tooling).
  - When updating `AGENTS.md` or Copilot instructions, extend and tighten guidance instead of replacing it.

For full details and rationale, the sections below are **normative** and must be followed exactly.

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

## 🧹 Deep Repository Cleanup, Restructuring, and Tooling Simplification (Strict Governance)

Prompt: **Deep Repository Cleanup, Restructuring, and Tooling Simplification (Strict Governance)**

When you are asked to perform deep cleanup, restructuring, or tooling simplification for this repository, you MUST follow the rules below in addition to all other rules in this file.

The goal is to make the repo lean, well-organized, easy to navigate, and simple to build across frontend, backend, and data layers.

**Hard constraints for cleanup tasks:**

- If something is not adding clear value, it should be deleted, not archived.
- Do **not** create `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/`, or similar folders.
- Do **not** create or modify any CI/CD pipelines or workflow configs:
  - No GitHub Actions, no `.github/workflows/*` files.
  - No Azure Pipelines or other pipeline YAMLs.
- Do **not** introduce or expand Turborepo or any similar orchestration tooling. Prefer simple root-level `pnpm`/`npm` scripts for local dev and build.
- Do **not** create new documentation files. Update existing docs instead (see Documentation Rules above).
- Always read and respect `AGENTS.md` and `.github/copilot-instructions.md` before making changes.

### 1. Identify deletable items (code + non-code)

You must:

- **Find unused, obsolete, or dead code** (files, modules, components, scripts).
- **Flag redundant or duplicate implementations** that can be removed or merged.
- **Identify POC / spike / demo / experiment code** that is no longer needed.
- **Aggressively target non-code clutter**, including:
  - Old, outdated, irrelevant, or conflicting documentation.
  - Design dumps, exports, screenshots, and throwaway notes.
  - Generated artifacts, logs, temp files, `.zip`/archives, random exports, backups, etc.

For each candidate, specify:

- Path
- What it is (short description)
- Why it’s low-value or safe to delete
- Any risks or dependencies to double-check before deletion

**Rule:** Do not propose archives or “legacy” folders. If something is not clearly useful for active development or production support, recommend deleting it.

### 2. Improve repo structure & organization (Frontend / Backend / Data)

You must propose a clear, opinionated repo structure that separates concerns and makes navigation obvious.

**Frontend** (e.g., `apps/web/`):

- Suggest a logical structure for:
  - `pages` / routes
  - `components`
  - `features` / domains
  - `hooks`
  - `services` / API clients
  - state (store, context, etc.)
  - assets (images, icons, styles)
- Identify where UI code is scattered or duplicated and propose consolidation into shared, clearly named locations.

**Backend / API** (e.g., `apps/services/`, `backend/`, `api/`):

- Group code by clear responsibilities:
  - routes / controllers / handlers
  - services / use-cases
  - repositories / persistence
  - jobs / workers / schedulers
  - integrations (external APIs, webhooks)
  - infrastructure (DB config, queues, messaging)
- Call out “god modules” or mixed-concern files and propose splitting and relocating them.

**Data / ML / Analytics** (e.g., `data/`, `ml/`, `analytics/`):

- Separate:
  - `raw/` data
  - `processed/` data
  - `notebooks/`
  - `scripts/` (ETL, training, evaluation)
  - `models/` (artifacts, configs)
- Identify one-off analysis, junk data, and large artifacts that should not be in Git and should be removed from the repo.

Also:

- Reduce top-level folder noise by grouping related items instead of many small, unclear directories.
- Highlight any cross-cutting folders like `utils`, `common`, or `shared` that are becoming dumping grounds, and propose a more feature-/domain-oriented structure.

### 3. Recommend better naming & conventions

You must:

- Identify vague, misleading, or generic names, such as:
  - Folders: `misc/`, `old/`, `new/`, `temp/`, `test/`, `backup/`, `final/`, `stuff/`.
  - Files: `index2.js`, `final_final.py`, `backup_old.ipynb`, etc.
- Propose clear, descriptive names for:
  - **Frontend:** `features/`, `components/`, `layouts/`, `shared-ui/`, `hooks/`, `services/`, `state/`.
  - **Backend:** `domains/`, `services/`, `repositories/`, `controllers/`, `jobs/`, `integrations/`.
  - **Data:** `raw/`, `processed/`, `features/`, `models/`, `notebooks/`, `scripts/`.
- Define and apply a consistent naming convention (preferably domain-/feature-based) across:
  - Folders
  - Modules
  - Components
  - Data pipelines and scripts

### 4. Consolidate & simplify code and documentation (no archives)

You must:

- Identify similar or overlapping modules, components, or services and propose how to:
  - Consolidate them into a single implementation, or
  - Extract shared logic into clear, well-named shared modules.
- Treat documentation with the same rigor as code:
  - Detect duplicate, overlapping, or conflicting docs and propose a single, up-to-date source of truth.
  - Clearly specify which docs should remain and which should be deleted.
- Do **not** create or suggest `archive/`, `legacy/`, or similar folders.
- Outdated, low-value, or noisy docs should be removed from the repo, not parked elsewhere.
- Call out config sprawl:
  - Multiple `.env` formats, duplicated environment files, or outdated CI/CD/build configs.
  - Recommend a minimal, unified configuration approach.

### 5. Tooling, Turborepo removal, and scripts simplification

Focus on simplifying the build and dev tooling.

If Turborepo (or similar monorepo orchestration tooling) is present, you must:

- Identify all Turborepo-related config and tooling files (e.g., `turbo.json`, pipeline configs, Turborepo-specific scripts).
- Propose a plan to remove Turborepo entirely from the repo.
- Replace Turborepo-based workflows with simple root-level `package.json` scripts using `npm` or `pnpm` (`pnpm` preferred if already used).

For each replaced pipeline, specify:

- The old Turborepo command
- The new root-level script(s) that should be used instead
- Any required changes to local developer workflows (not new CI/CD).

More generally, detect tooling bloat:

- Multiple linters/formatters/test runners/build tools doing overlapping jobs.
- Legacy scripts or task runners that no longer match the current stack.

Recommend a minimal, standard toolchain, with:

- A single formatter
- A single linter
- Clear `dev`, `build`, `test`, and `lint` scripts at the repo root
- Simple workspace/`pnpm` or `npm` scripts if there are multiple packages, without extra orchestration layers unless strictly necessary.

**Hard rule:**

- Do **not** create or propose any new CI/CD pipelines, GitHub Actions, or workflow YAML files.
- Do **not** scaffold `.github/workflows/*` or equivalent CI/CD config.
- Limit changes to local dev and build scripts only.

### 6. Detect bloat in assets, dependencies, and data

You must:

- Identify oversized or unnecessary assets (images, media, binaries) that:
  - Should be compressed, moved out of the repo, or
  - Deleted if not actually used.
- Find libraries and dependencies that are:
  - Unused,
  - Barely used but add significant complexity,
  - Redundant with built-in language features or existing utilities within the repo.
- For data/ML:
  - Flag large data dumps, checkpoints, and model artifacts that do not belong in Git and should be removed from the repo (with a note that they should live in a proper data or artifact store).

### 7. Priority and risk classification

For each recommendation, classify it as:

- **P1 – Safe win:** Very low risk, clearly redundant or noise.
- **P2 – Needs validation:** Likely safe but should be validated with a quick search, run, or smoke test.
- **P3 – Structural change:** Higher impact to structure, naming, or tooling; may require staged rollout and updates to tests.

### 8. Phased cleanup & restructuring plan

Group changes into phases that can be implemented safely:

- **Phase 1: Quick wins**
  - Delete clearly redundant files, junk assets, throwaway docs, temp data, and unused dependencies.
  - Fix the worst naming offenders that are clearly safe to change.
- **Phase 2: Structural refactor**
  - Apply the improved frontend/backend/data folder structures.
  - Move and consolidate modules, components, and docs as proposed.
- **Phase 3: Tooling & Turborepo removal**
  - Remove Turborepo and any unnecessary orchestration tooling.
  - Introduce simple root-level `npm`/`pnpm` scripts for local development and builds.
  - Finalize dependency and tooling simplification.

For each phase, describe:

- The objective
- The key actions
- The tests/checks to run (unit, integration, e2e, lint, build, data pipeline checks, etc.).

### 9. Strict governance for `AGENTS.md` and Copilot/AI instructions

After designing the target structure and cleanup recommendations:

#### 9.1 Read before modifying

Before editing any of these files, you must:

- Read the existing content of:
  - `AGENTS.md` (or equivalent agents configuration)
  - Any Copilot/AI instructions files (e.g. `.github/copilot-instructions.md`, `.github/copilot/*.md`, or similar)
- Preserve existing valid rules and constraints unless they clearly conflict with the new repo structure and cleanliness rules.

#### 9.2 Update by extending, not replacing

Do not delete or wholesale rewrite these files. Instead:

- Extend and adjust them to:
  - Document the approved repo structure (frontend, backend, data, shared).
  - Specify exactly where new files of each type should go (components, services, scripts, data, docs).
  - Define what must **not** be created:
    - No `misc/`, `temp/`, `archive/`, `old/`, `backup/`, `legacy/`, etc.
    - No large datasets, model binaries, or artifacts committed to the repo.
- Add rules for documentation:
  - Always update the single source of truth instead of creating new parallel docs.
  - Do not create disposable docs in random locations.
- Insert new sections or bullet points rather than wiping out existing guidance.

#### 9.3 Explicit rules for AI/assistants (Copilot and agents)

You must update instructions so AI tools:

- Follow the canonical folder structure and naming conventions.
- Avoid generating “dumping ground” folders or vague file names.
- Avoid adding demo/spike code or sample data directly into main app directories.
- Place tests, docs, and configs only in their designated locations.
- Respect the no-archive, no-junk rule (no `archive/`, `legacy/`, or `backup` folders).

**Hard rule:** When updating `AGENTS.md` and Copilot instructions, you must read and build on existing content, not replace it wholesale. The intent is to tighten and extend guardrails, not erase them.

### 10. Output format for cleanup recommendations

When you output cleanup findings, you must use a structured list or table with columns like:

- Type (Delete / Rename / Move / Consolidate / Refactor / Tooling / Instructions)
- Area (Frontend / Backend / Data / Shared / Tooling / Docs / Agents)
- Path
- Current Name / Structure
- Proposed Name / Structure
- Description
- Reason
- Risk (P1/P2/P3)
- Suggested Action

Assume the target state is a lean, production-focused repo with:

- Clear separation of frontend, backend, and data.
- Descriptive, consistent naming and folder structure.
- No Turborepo (if present), replaced by simple root-level `npm`/`pnpm` scripts for local dev/build.
- No archives, no junk, and no low-value clutter.
- `AGENTS.md` and Copilot/AI instructions that have been read, respected, and extended—and that proactively prevent the same mess from happening again.
- Absolutely no new CI/CD pipelines or GitHub Actions/workflows introduced as part of this process.

