# Copilot Instructions – ApexCoachAI

This repo deploys into a **shared Azure platform**. Do **not** create new resource groups.

## Allowed Resource Groups (Subscription: 44e77ffe-2c39-4726-b6f0-2c733c7ffe78)

- `rg-shared-ai` – Azure OpenAI `shared-openai-eastus2`, AI Search `shared-search-standard-eastus2`
- `rg-shared-data` – PostgreSQL `pg-shared-apps-eastus2`, Storage `stmahumsharedapps`
- `rg-shared-container-apps` – Container Apps environments, ACR `acrsharedapps`
- `rg-shared-web` – Static Web App `apexcoachai`
- `rg-shared-logs` – Log Analytics `law-shared-apps-eastus2`, App Insights `appi-shared-apps-eastus2`
- `rg-shared-dns` – DNS zones, certificates
- `rg-shared-backup` – Backups

## App-Specific Resources for `apexcoachai`

- When you need a **database**:
  - Use DB `apexcoachai_db` on server `pg-shared-apps-eastus2` with `sslmode=require`.
  - Connection: `postgresql://pgadmin:<password>@pg-shared-apps-eastus2.postgres.database.azure.com:5432/apexcoachai_db?sslmode=require`

- When you need **blob storage**:
  - Use container `apexcoachai` on storage account `stmahumsharedapps`.
  - Do **not** create a new storage account.

- When you need **AI Search**:
  - Use index `idx-apexcoachai-primary` on service `shared-search-standard-eastus2`.
  - Data source: `ds-apexcoachai-primary` (if needed)
  - Indexer: `ixr-apexcoachai-primary` (if needed)

- When deploying **Static Web App**:
  - Use SWA `apexcoachai` in `rg-shared-web`.

- When deploying **container apps**:
  - Environment: `cae-shared-apps-dev` / `cae-shared-apps-prod` in `rg-shared-container-apps`
  - API app: `ca-apexcoachai-api`
  - Images: `acrsharedapps.azurecr.io/apexcoachai-api:<tag>`

## Infrastructure Code Rules

When generating Bicep, Terraform, or Azure CLI:
- **Never** use `az group create` or define new resource groups.
- **Never** create PostgreSQL servers, storage accounts, AI Search services, or OpenAI resources.
- **Always** extend existing shared resources (new DB, new container, new index) instead of provisioning new ones.

## Configuration

- Assume `.env` (local, gitignored) contains:
  - `DATABASE_URL` pointing to `apexcoachai_db` on `pg-shared-apps-eastus2`
  - `AZURE_OPENAI_ENDPOINT=https://shared-openai-eastus2.openai.azure.com/`
  - `AZURE_SEARCH_ENDPOINT=https://shared-search-standard-eastus2.search.windows.net/`
  - `AZURE_STORAGE_CONTAINER=apexcoachai`
- Use **placeholders** for secrets in examples; never hard-code keys or passwords.

## Work Ethic

- **Do the hard work**: Search this repo for existing infra scripts and extend them.
- **Avoid shortcuts**: No per-developer resources, isolated RGs, or "temporary" services.
- Prefer improving existing patterns over adding new services.
