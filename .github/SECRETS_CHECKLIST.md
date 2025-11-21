# GitHub Secrets & Variables Checklist

Use this checklist to ensure all required secrets and variables are configured in your GitHub repository.

## How to Access

1. Go to your repository on GitHub
2. Navigate to **Settings → Secrets and variables → Actions**
3. Configure secrets in the **Secrets** tab
4. Configure variables in the **Variables** tab

---

## Required Repository Secrets

Configure these in: **Settings → Secrets and variables → Actions → Secrets**

### Azure Authentication
- [ ] `AZURE_CREDENTIALS` - JSON service principal credentials
  - Format: `{"clientId":"...","clientSecret":"...","tenantId":"..."}`
  - Used by: `azure-dev.yaml`, `ci-deploy.yml` (provision-infra job)
  - **Status**: ⚠️ Check if configured

### Static Web Apps Deployment
- [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` - Deployment token for Azure Static Web Apps
  - Get from: Azure Portal → Static Web App → Manage deployment token
  - Used by: `ci-deploy.yml` (deploy-static job)
  - **Status**: ⚠️ Check if configured

---

## Required Repository Variables

Configure these in: **Settings → Secrets and variables → Actions → Variables**

### Azure Service Principal (for OIDC/Federated Auth)
- [ ] `AZURE_CLIENT_ID` - Service principal client ID
  - Value: `f3327c69-6e83-4e9f-a0ec-7aa854d35668` (from your .env.local)
  - Used by: All workflows for Azure authentication
  - **Status**: ⚠️ Check if configured

- [ ] `AZURE_TENANT_ID` - Azure AD tenant ID
  - Value: `71f8de90-0c77-41a1-9592-d1b104c46c24` (from your .env.local)
  - Used by: All workflows for Azure authentication
  - **Status**: ⚠️ Check if configured

- [ ] `AZURE_SUBSCRIPTION_ID` - Azure subscription ID
  - Value: `44e77ffe-2c39-4726-b6f0-2c733c7ffe78` (from your .env.local)
  - Used by: All workflows for Azure operations
  - **Status**: ⚠️ Check if configured

### Azure Developer CLI Configuration
- [ ] `AZURE_ENV_NAME` - Azure Developer CLI environment name
  - Example: `apexcoach-ai` or `apexcoach-ai-prod`
  - Used by: `azure-dev.yaml`, `ci-deploy.yml` (provision-infra job)
  - **Status**: ⚠️ Check if configured

- [ ] `AZURE_LOCATION` - Azure region
  - Value: `eastus2` (or your preferred region)
  - Used by: `azure-dev.yaml`, `ci-deploy.yml` (provision-infra job)
  - **Status**: ⚠️ Check if configured

### Optional Variables
- [ ] `AZURE_ALIAS` - Optional subscription alias
  - Only needed for Microsoft internal subscriptions
  - Leave empty if not applicable
  - **Status**: ⚠️ Check if needed

---

## Verification Steps

### 1. Check Current Configuration

Run this command to see what's currently configured (requires GitHub CLI):

```bash
gh secret list
gh variable list
```

Or manually check in GitHub UI:
- Go to **Settings → Secrets and variables → Actions**

### 2. Test Workflow Execution

After configuring secrets:
1. Go to **Actions** tab
2. Run the `ci-deploy.yml` workflow manually
3. Check if authentication succeeds
4. Verify deployment completes

### 3. Validate Secret Usage

Check workflow files to ensure secrets are used correctly:
- `.github/workflows/azure-dev.yaml`
- `.github/workflows/ci-deploy.yml`

---

## Quick Setup Script

If you have GitHub CLI installed, you can set secrets programmatically:

```bash
# Set secrets (requires GitHub CLI and appropriate permissions)
gh secret set AZURE_CREDENTIALS --body '{"clientId":"...","clientSecret":"...","tenantId":"..."}'
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "your-token-here"

# Set variables
gh variable set AZURE_CLIENT_ID --body "f3327c69-6e83-4e9f-a0ec-7aa854d35668"
gh variable set AZURE_TENANT_ID --body "71f8de90-0c77-41a1-9592-d1b104c46c24"
gh variable set AZURE_SUBSCRIPTION_ID --body "44e77ffe-2c39-4726-b6f0-2c733c7ffe78"
gh variable set AZURE_ENV_NAME --body "apexcoach-ai"
gh variable set AZURE_LOCATION --body "eastus2"
```

---

## Security Notes

- ✅ Secrets are encrypted and only visible to authorized workflows
- ✅ Variables are visible in workflow logs (use secrets for sensitive data)
- ✅ Never commit secrets to the repository
- ✅ Rotate secrets regularly (every 90 days recommended)
- ✅ Use least privilege - grant only necessary permissions

---

## Troubleshooting

### Workflow Fails with "Authentication Failed"
- Verify `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CREDENTIALS` are set
- Check service principal has correct permissions
- Verify federated credentials are configured (if using OIDC)

### Deployment Fails with "Invalid Token"
- Regenerate `AZURE_STATIC_WEB_APPS_API_TOKEN` in Azure Portal
- Verify token hasn't expired
- Check token is for the correct Static Web App resource

### "Variable Not Found" Errors
- Ensure all required variables are set in GitHub Variables
- Check variable names match exactly (case-sensitive)
- Verify you're using `vars.VARIABLE_NAME` syntax in workflows

---

**Last Updated**: 2025-01-20
**Next Review**: 2025-04-20 (quarterly secret rotation)

