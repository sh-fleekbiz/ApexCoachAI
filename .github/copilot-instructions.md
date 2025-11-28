# Copilot Instructions for ApexCoachAI

1. **Technology Stack:**

   - **AI API:** Azure OpenAI Responses API (`/v1/responses`).
   - **Primary Model:** `gpt-5.1-codex-mini`.
   - **Database:** PostgreSQL with `pgvector`.
   - **Infrastructure:** Shared Azure Resources (Read-Only).

2. **Coding Standards:**

   - **Do Not** suggest creating Azure Resources (Terraform/Bicep).
   - **Do Not** use Azure AI Search SDKs.
   - **Do** use `fetch` or `requests` to call the Responses API REST endpoint.
   - **Do** use strict Environment Variable naming (e.g., `AI_MODEL_GENERAL`).
   - **Do** use `input` field instead of `messages` array for API calls.
   - **Do** use `api-key` header for authentication (not Bearer token).
   - **Do** use `max_output_tokens` parameter (not `max_tokens` or `max_completion_tokens`).

3. **Frontend:**

   - Never expose `AZURE_OPENAI_API_KEY`.
   - API calls must go through the Next.js/Express backend.

4. **API Pattern:**

   - Use stateful Responses API with `previous_response_id` for conversations.
   - Store response IDs on the client/backend to maintain conversation state.
   - Use `/openai/v1/responses` endpoint (v1 GA, no api-version param).

5. **Vector Search:**

   - Use `pgvector` extension on shared Postgres database.
   - Generate embeddings with `text-embedding-3-small`.
   - Store and query vectors in the `apexcoachai` database.
