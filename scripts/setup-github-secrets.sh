#!/bin/bash

# GitHub Secrets & Variables Setup Script
# Uses GitHub CLI (gh) to configure repository secrets and variables
# 
# Prerequisites:
#   1. Install GitHub CLI: https://cli.github.com/
#   2. Authenticate: gh auth login
#   3. Ensure you have admin access to the repository
#
# Usage:
#   ./scripts/setup-github-secrets.sh

set -e

echo "🔐 GitHub Secrets & Variables Setup for Apex Coach AI"
echo "======================================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "   Install from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "   Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Load secrets from .env.local if it exists
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  Warning: $ENV_FILE not found"
    echo "   Secrets will need to be entered manually or from Azure Key Vault"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Function to set secret from env file or prompt
set_secret() {
    local secret_name=$1
    local env_var=$2
    local description=$3
    
    if [ -f "$ENV_FILE" ]; then
        # Try to extract from .env.local
        local value=$(grep "^${env_var}=" "$ENV_FILE" 2>/dev/null | cut -d '=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//" || echo "")
        
        if [ -n "$value" ] && [ "$value" != "<PLACEHOLDER_${env_var}>" ]; then
            echo "Setting secret: $secret_name"
            echo "$value" | gh secret set "$secret_name"
            echo "  ✅ $secret_name set"
            return 0
        fi
    fi
    
    echo "⚠️  $secret_name not found in $ENV_FILE"
    echo "   Description: $description"
    read -p "   Enter value manually (or press Enter to skip): " -s value
    echo
    if [ -n "$value" ]; then
        echo "$value" | gh secret set "$secret_name"
        echo "  ✅ $secret_name set"
    else
        echo "  ⏭️  Skipped $secret_name"
    fi
}

# Function to set variable from env file or prompt
set_variable() {
    local var_name=$1
    local env_var=$2
    local description=$3
    
    if [ -f "$ENV_FILE" ]; then
        local value=$(grep "^${env_var}=" "$ENV_FILE" 2>/dev/null | cut -d '=' -f2- | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//" || echo "")
        
        if [ -n "$value" ] && [ "$value" != "<PLACEHOLDER_${env_var}>" ]; then
            echo "Setting variable: $var_name"
            gh variable set "$var_name" --body "$value"
            echo "  ✅ $var_name set to $value"
            return 0
        fi
    fi
    
    echo "⚠️  $var_name not found in $ENV_FILE"
    echo "   Description: $description"
    read -p "   Enter value manually (or press Enter to skip): " value
    if [ -n "$value" ]; then
        gh variable set "$var_name" --body "$value"
        echo "  ✅ $var_name set"
    else
        echo "  ⏭️  Skipped $var_name"
    fi
}

echo "📋 Setting Repository Secrets..."
echo "-----------------------------------"

# Set secrets
set_secret "AZURE_CREDENTIALS" "AZURE_CLIENT_SECRET" "JSON service principal: {\"clientId\":\"...\",\"clientSecret\":\"...\",\"tenantId\":\"...\"}"
set_secret "AZURE_STATIC_WEB_APPS_API_TOKEN" "AZURE_STATIC_WEB_APPS_API_TOKEN" "Azure Static Web Apps deployment token"

echo ""
echo "📋 Setting Repository Variables..."
echo "-----------------------------------"

# Set variables
set_variable "AZURE_CLIENT_ID" "AZURE_CLIENT_ID" "Service principal client ID"
set_variable "AZURE_TENANT_ID" "AZURE_TENANT_ID" "Azure AD tenant ID"
set_variable "AZURE_SUBSCRIPTION_ID" "AZURE_SUBSCRIPTION_ID" "Azure subscription ID"
set_variable "AZURE_ENV_NAME" "AZURE_ENV_NAME" "Azure Developer CLI environment name (e.g., apexcoach-ai)"
set_variable "AZURE_LOCATION" "AZURE_LOCATION" "Azure region (e.g., eastus2)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify secrets: gh secret list"
echo "   2. Verify variables: gh variable list"
echo "   3. Test workflow: Go to Actions tab and run a workflow"
echo ""

