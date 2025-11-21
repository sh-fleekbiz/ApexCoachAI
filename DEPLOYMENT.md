# Apex Coach AI Deployment

## How it works

- **CI/CD platform:** GitHub Actions.
- **Primary frontend workflow:** `.github/workflows/deploy.yml`.
- **Target Azure resource:** Azure **Static Web App** for Apex Coach AI in `rg-shared-web` (bound via the Static Web Apps deployment token).
- **Optional infra/app workflow:** `.github/workflows/azure-dev.yaml` uses Azure Developer CLI (azd) to provision/update infrastructure and deploy the app; this is now **manual-only**.

## How to deploy

### Automatic (recommended demo path)

- **Trigger:** Push to the `main` branch.
- **Workflow:** `Deploy to Azure Static Web Apps` (`deploy.yml`).
- **What it does:**
  - Checks out the repo.
  - Installs dependencies with `pnpm install --frozen-lockfile`.
  - Builds the app with `pnpm build` using `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_OPENAI_API_KEY` from secrets.
  - Uploads the built `dist` to the configured Static Web App using `Azure/static-web-apps-deploy@v1`.
- **Result:** The latest commit on `main` is deployed to the shared Apex Coach AI Static Web App in `rg-shared-web`.

### Manual redeploy of a commit

- In GitHub, open **Actions → Deploy to Azure Static Web Apps → Run workflow**.
- Select the branch/commit (typically `main`) and run.

### Advanced: azd-based infra + app deployment

- Workflow: `Deploy on Azure` (`azure-dev.yaml`).
- **Trigger:** Manual only (`workflow_dispatch`). It no longer runs automatically on pushes.
- When you run it:
  - Uses `Azure/setup-azd` to install Azure Developer CLI.
  - Authenticates with Azure (OIDC or client credentials).
  - Runs `azd up --no-prompt` using repo variables such as `AZURE_ENV_NAME` and `AZURE_LOCATION`.
- **Use cases:**
  - Initial provisioning or re-provisioning of the Apex Coach AI infrastructure.
  - End-to-end recreation of the app + infra in a controlled, manual way.

## Required configuration (once per repo)

### Secrets and variables for SWA deploy (`deploy.yml`)

- **`AZURE_STATIC_WEB_APPS_API_TOKEN`** – SWA deployment token for the Apex Coach AI Static Web App in `rg-shared-web`.

### Vars/secrets for azd workflow (`azure-dev.yaml`)

Configured typically as **repository variables** and **secrets**:

- **Vars**
  - `AZURE_CLIENT_ID` – Client ID for the federated credentials / service principal.
  - `AZURE_TENANT_ID` – Azure AD tenant ID.
  - `AZURE_SUBSCRIPTION_ID` – MahumTech subscription ID.
  - `AZURE_ENV_NAME` – azd environment name for Apex Coach AI (single shared env).
  - `AZURE_LOCATION` – Azure region (e.g. `eastus2`).
  - `AZURE_ALIAS` – Optional alias for internal subscriptions.

- **Secrets**
  - `AZURE_CREDENTIALS` – JSON service principal credentials (used when not using OIDC-only auth).

Once these are set, pushing to `main` is sufficient to build and deploy the latest Apex Coach AI frontend to the shared demo environment; the azd workflow remains available for deliberate infra changes.
