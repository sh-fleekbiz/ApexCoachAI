# Secrets Management Guide - Apex Coach AI

## 🚨 CRITICAL SECURITY NOTICE

**NEVER commit secrets to the repository.** All `.env.local` files and files containing actual credentials must be:
- Listed in `.gitignore`
- Never committed to git
- Stored securely using Azure Key Vault or GitHub Secrets

---

## Overview

This document outlines how to securely manage secrets for the Apex Coach AI project across:
- **Local Development**: Environment variables in `.env.local` (not tracked in git)
- **GitHub Actions**: Repository secrets and variables
- **GitHub Copilot**: Environment configuration
- **Azure Services**: Key Vault and managed identities (recommended for production)

---

## Required Secrets Inventory

### Azure OpenAI & AI Services
- `AZURE_OPENAI_KEY` - Primary OpenAI API key
- `AZURE_OPENAI_API_KEY` - Secondary OpenAI key (if needed)
- `AZURE_AI_KEY` - Unified AI Services key
- `AZURE_DOCINT_KEY` - Document Intelligence key
- `AZURE_LANGUAGE_KEY` - Language Services key
- `AZURE_SPEECH_KEY` - Speech Services key
- `AZURE_VISION_KEY` - Vision Services key

### Azure Search
- `AZURE_SEARCH_API_KEY` - Azure AI Search admin key

### Azure Storage
- `AZURE_STORAGE_CONNECTION_STRING` - Full storage account connection string
- `AZURE_STORAGE_ACCOUNT` - Storage account name (non-sensitive)

### Azure Service Principal (for CI/CD)
- `AZURE_TENANT_ID` - Azure AD tenant ID (non-sensitive)
- `AZURE_CLIENT_ID` - Service principal client ID (non-sensitive)
- `AZURE_CLIENT_SECRET` - Service principal secret (SENSITIVE)
- `AZURE_SUBSCRIPTION_ID` - Azure subscription ID (non-sensitive)

### Azure Static Web Apps
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Deployment token for SWA

### PostgreSQL (if used)
- `PGHOST` - Database host (non-sensitive)
- `PGPORT` - Database port (non-sensitive)
- `PGDATABASE` - Database name (non-sensitive)
- `PGPASSWORD` - Database password (SENSITIVE - if not using managed identity)

---

## Local Development Setup

### Step 1: Create `.env.local` File

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

**IMPORTANT**: `.env.local` is in `.gitignore` and will NOT be committed.

### Step 2: Get Secrets from Azure Key Vault (Recommended)

If using Azure Key Vault:

```bash
# Install Azure CLI if not already installed
az login

# Set your Key Vault name
KEY_VAULT_NAME="your-keyvault-name"

# Retrieve secrets
az keyvault secret show --vault-name $KEY_VAULT_NAME --name azure-openai-key --query value -o tsv
az keyvault secret show --vault-name $KEY_VAULT_NAME --name azure-search-api-key --query value -o tsv
az keyvault secret show --vault-name $KEY_VAULT_NAME --name azure-storage-connection-string --query value -o tsv
```

### Step 3: Validate Local Environment

Run the validation script:

```bash
# Validate all required secrets are present
node scripts/validate-secrets.js
```

---

## GitHub Repository Secrets Configuration

### Required Repository Secrets

Configure these in: **Settings → Secrets and variables → Actions → Secrets**

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AZURE_CREDENTIALS` | JSON service principal credentials | `{"clientId":"...","clientSecret":"...","tenantId":"..."}` |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Static Web App deployment token | Token from Azure Portal |

### Required Repository Variables

Configure these in: **Settings → Secrets and variables → Actions → Variables**

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `AZURE_CLIENT_ID` | Service principal client ID | `f3327c69-6e83-4e9f-a0ec-7aa854d35668` |
| `AZURE_TENANT_ID` | Azure AD tenant ID | `71f8de90-0c77-41a1-9592-d1b104c46c24` |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID | `44e77ffe-2c39-4726-b6f0-2c733c7ffe78` |
| `AZURE_ENV_NAME` | Azure Developer CLI environment name | `apexcoach-ai` |
| `AZURE_LOCATION` | Azure region | `eastus2` |
| `AZURE_ALIAS` | Optional subscription alias | (leave empty if not needed) |

### How to Set GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

### How to Set GitHub Variables

1. Go to **Settings → Secrets and variables → Actions**
2. Click on the **Variables** tab
3. Click **New repository variable**
4. Enter the variable name and value
5. Click **Add variable**

---

## GitHub Copilot Environment Configuration

### Current Configuration

The Copilot environment is configured in `.github/copilot/agent-environment.yml`.

### Environment Variables for Copilot

**Non-sensitive values** (endpoints, deployment names) can be set directly in the YAML:

```yaml
env:
  AZURE_OPENAI_ENDPOINT: https://shared-openai-eastus2.cognitiveservices.azure.com/
  AZURE_OPENAI_CHAT_DEPLOYMENT: gpt-5.1-mini
  AZURE_SEARCH_ENDPOINT: https://shared-search-standard-eastus2.search.windows.net
```

### Secrets for Copilot

**Sensitive values** (API keys, connection strings) should be:
1. Stored in GitHub Copilot environment secrets (if available)
2. Or referenced from Azure Key Vault
3. Or passed via secure environment variables

**Note**: GitHub Copilot environments may have limited secret support. For sensitive data:
- Use Azure Key Vault references
- Or configure via secure environment injection

### Updating Copilot Environment

Edit `.github/copilot/agent-environment.yml` and ensure:
- No actual secrets are hardcoded
- Only endpoints and non-sensitive configuration is included
- Secrets are referenced via secure methods

---

## Azure Key Vault Integration (Recommended for Production)

### Benefits
- Centralized secret management
- Automatic rotation support
- Access control via RBAC
- Audit logging
- Integration with Azure services

### Setup Steps

1. **Create Key Vault** (if not exists):
```bash
az keyvault create \
  --name apexcoach-ai-kv \
  --resource-group rg-shared-web \
  --location eastus2
```

2. **Store Secrets**:
```bash
az keyvault secret set --vault-name apexcoach-ai-kv --name azure-openai-key --value "YOUR_KEY"
az keyvault secret set --vault-name apexcoach-ai-kv --name azure-search-api-key --value "YOUR_KEY"
az keyvault secret set --vault-name apexcoach-ai-kv --name azure-storage-connection-string --value "YOUR_CONNECTION_STRING"
```

3. **Grant Access** (for local development):
```bash
az keyvault set-policy \
  --name apexcoach-ai-kv \
  --upn your-email@domain.com \
  --secret-permissions get list
```

4. **Use in Application**:
   - For Azure services: Use managed identity (recommended)
   - For local dev: Use Azure CLI authentication
   - For CI/CD: Use service principal with Key Vault access

---

## Azure Services Configuration

### Container Apps & App Services

For deployed services, use **Managed Identity** (recommended) or **Application Settings**:

#### Option 1: Managed Identity (Recommended)
1. Enable managed identity on the service
2. Grant Key Vault access to the managed identity
3. Reference secrets from Key Vault in application settings

#### Option 2: Application Settings
1. Set secrets as application settings in Azure Portal
2. Mark sensitive values as "Secure" (they won't be visible in logs)
3. Reference via environment variables in code

### Static Web Apps

Static Web Apps use:
- **GitHub Actions** for deployment (uses `AZURE_STATIC_WEB_APPS_API_TOKEN`)
- **Environment variables** for runtime configuration (set in Azure Portal)

---

## Validation Checklist

### ✅ Local Development
- [ ] `.env.local` exists and contains all required secrets
- [ ] `.env.local` is NOT tracked in git (check with `git ls-files | grep .env.local`)
- [ ] `.env.example` is up to date with all required variables
- [ ] Local app can connect to Azure services

### ✅ GitHub Repository
- [ ] All required secrets are configured in GitHub Secrets
- [ ] All required variables are configured in GitHub Variables
- [ ] GitHub Actions workflows can authenticate to Azure
- [ ] No secrets are hardcoded in workflow files

### ✅ GitHub Copilot
- [ ] `.github/copilot/agent-environment.yml` contains only non-sensitive config
- [ ] No actual API keys or secrets are in the YAML file
- [ ] Copilot environment can access necessary endpoints

### ✅ Azure Services
- [ ] Key Vault is created and contains all secrets (if using)
- [ ] Managed identities are configured (if using)
- [ ] Application settings are configured for deployed services
- [ ] Access policies are properly configured

---

## Security Best Practices

1. **Never commit secrets** - Always use `.gitignore` for `.env.local` files
2. **Rotate secrets regularly** - Update keys every 90 days or when compromised
3. **Use least privilege** - Grant only necessary permissions
4. **Use managed identities** - Prefer managed identity over service principals when possible
5. **Enable audit logging** - Monitor access to secrets
6. **Use Key Vault** - Centralize secret management for production
7. **Separate environments** - Use different secrets for dev/staging/prod
8. **Validate secrets** - Use validation scripts before deployment

---

## Troubleshooting

### Local Development Issues

**Problem**: App can't connect to Azure services
- **Solution**: Verify `.env.local` exists and contains correct values
- **Check**: Run `node scripts/validate-secrets.js`

**Problem**: Secrets not loading
- **Solution**: Ensure `.env.local` is in the project root
- **Check**: Verify environment variable names match code expectations

### GitHub Actions Issues

**Problem**: Authentication fails
- **Solution**: Verify `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CREDENTIALS` are set
- **Check**: Ensure service principal has correct permissions

**Problem**: Deployment fails
- **Solution**: Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is set correctly
- **Check**: Token may have expired - regenerate in Azure Portal

### Azure Services Issues

**Problem**: Can't access Key Vault
- **Solution**: Verify managed identity or service principal has Key Vault access
- **Check**: Review Key Vault access policies

---

## Emergency Procedures

### If Secrets Are Exposed

1. **Immediately rotate all exposed secrets**
2. **Review git history** - Check if secrets were committed
3. **Remove from git** - Use `git filter-branch` or BFG Repo-Cleaner if needed
4. **Notify team** - Alert all developers
5. **Review access logs** - Check for unauthorized access
6. **Update documentation** - Document the incident

### Secret Rotation Process

1. Generate new secrets in Azure Portal or Key Vault
2. Update GitHub Secrets
3. Update local `.env.local` files
4. Update Azure Application Settings (if applicable)
5. Test all services
6. Revoke old secrets after verification

---

## Additional Resources

- [Azure Key Vault Documentation](https://learn.microsoft.com/azure/key-vault/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Azure Managed Identities](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/)
- [GitHub Copilot Environment Configuration](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment)

---

**Last Updated**: 2025-01-20
**Maintained By**: Apex Coach AI Team

