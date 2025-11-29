# Copilot Instructions for ApexCoachAI

1. **Technology Stack:**

   - **AI API:** Azure OpenAI Responses API (`/v1/responses`).
   - **Primary Model:** `gpt-5.1-codex-mini`.
   - **Database:** PostgreSQL with `pgvector`.
   - **Infrastructure:** Shared Azure Resources (Read-Only).

2. **Repository Structure & Governance:**

   - **Follow Canonical Structure:** Use `apps/web/` for frontend, `apps/services/` for backend
   - **Forbidden Folders:** Never create `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/`
   - **No Nested READMEs:** Don't create README.md files that just describe folder purpose
   - **No Dumping Grounds:** Avoid `utils/`, `common/`, `shared/` folders - use domain-specific structure
   - **Naming Conventions:** PascalCase for components, kebab-case for files
   - **Delete More Than You Add:** Always remove at least as much code as you add
   - **No Archives:** Delete unused code, don't create archive folders
   - **No CI/CD Changes:** Do not create or modify GitHub Actions, `.github/workflows/*`, Azure Pipelines, or any other CI/CD configuration.
   - **No Turborepo Orchestration:** Do not introduce or expand Turborepo (or similar orchestration). Prefer simple root-level `pnpm`/`npm` scripts for local dev and build.

3. **Coding Standards:**

   - **Do Not** suggest creating Azure Resources (Terraform/Bicep).
   - **Do Not** use Azure AI Search SDKs.
   - **Do** use `fetch` or `requests` to call the Responses API REST endpoint.
   - **Do** use strict Environment Variable naming (e.g., `AI_MODEL_CORE` not `AI_MODEL_GENERAL`).
   - **Do** use `input` field instead of `messages` array for API calls.
   - **Do** use `api-key` header for authentication (not Bearer token).
   - **Do** use `max_output_tokens` parameter (not `max_tokens` or `max_completion_tokens`).

4. **Frontend:**

   - Never expose `AZURE_OPENAI_API_KEY`.
   - API calls must go through the backend services.
   - Place components in `apps/web/src/components/`
   - Place pages in `apps/web/src/pages/`
   - Place hooks in `apps/web/src/hooks/` (create if needed)

5. **Backend:**

   - Place routes in `apps/services/[service]/src/routes/`
   - Place business logic in `apps/services/[service]/src/services/`
   - Place utilities in `apps/services/[service]/src/lib/`
   - Use approved dependencies only (see AGENTS.md)

6. **API Pattern:**

   - Use stateful Responses API with `previous_response_id` for conversations.
   - Store response IDs on the client/backend to maintain conversation state.
   - Use `/openai/v1/responses` endpoint (v1 GA, no api-version param).

7. **Vector Search:**

   - Use `pgvector` extension on shared Postgres database.
   - Generate embeddings with `text-embedding-3-small`.
   - Store and query vectors in the `apexcoachai` database.

8. **Code Quality:**

   - Never commit console.log statements in production code
   - Never leave TODO comments (implement or remove)
   - Never commit commented-out code blocks
   - Keep files under 500KB unless explicitly approved

9. **Documentation:**

   - Update existing docs instead of creating new ones
   - Document new environment variables in `.env.example`
   - Never create documentation archives or legacy folders

10. **Dependencies:**

    - Use only approved dependencies from whitelist
    - Audit new dependencies before adding
    - Remove unused dependencies immediately

11. **Deep Cleanup & Restructuring Tasks:**

    - When asked to perform repo cleanup, restructuring, or tooling simplification, follow the **"Deep Repository Cleanup, Restructuring, and Tooling Simplification (Strict Governance)"** section in `AGENTS.md`.
    - Do not create archives or legacy folders. Delete junk instead of moving it (no `archive/`, `old/`, `backup/`, `temp/`, `misc/`, `legacy/`).
    - Keep a clear separation of frontend (`apps/web/`), backend (`apps/services/`), and any data/ML/analytics areas.
    - Do not add or modify CI/CD pipelines, GitHub Actions, `.github/workflows/*`, or Azure DevOps pipelines as part of cleanup.
    - When simplifying tooling, remove Turborepo-style orchestration and use root-level `pnpm`/`npm` scripts instead.
    - Classify cleanup recommendations with P1/P2/P3 risk and group them into Phases 1–3 as defined in `AGENTS.md`.

12. **Cost Control (MANDATORY):**

    - Container Apps must use: minReplicas=0, maxReplicas=3, CPU=0.25, Memory=0.5Gi
    - Use `AI_MODEL_CORE` environment variable (not `AI_MODEL_GENERAL`)
    - Never increase resource limits without explicit approval
    - Scale-to-zero is required for all non-production workloads

**See AGENTS.md for complete governance rules (including deep-cleanup strict governance) and REPOSITORY_STRUCTURE.md for detailed structure guidelines.**
