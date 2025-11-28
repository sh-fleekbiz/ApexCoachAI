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
