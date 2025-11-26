#!/bin/bash
set -e

# ApexCoachAI Frontend Deployment Script
# Builds and deploys frontend to Azure Static Web App

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ApexCoachAI Frontend Deployment ===${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed.${NC}" >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo -e "${RED}pnpm is required but not installed.${NC}" >&2; exit 1; }
command -v az >/dev/null 2>&1 || { echo -e "${RED}Azure CLI is required but not installed.${NC}" >&2; exit 1; }

# Navigate to frontend directory
cd apps/frontend

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pnpm install

# Build production bundle
echo -e "${GREEN}Building production bundle...${NC}"
pnpm build

# Verify build output
if [ ! -d "dist" ]; then
  echo -e "${RED}Build failed - dist directory not found${NC}"
  exit 1
fi

echo -e "${GREEN}Build successful!${NC}"
echo "Build size: $(du -sh dist | cut -f1)"

# Deploy to Azure Static Web App
echo -e "${YELLOW}Deploying to Azure Static Web App...${NC}"

# Check if SWA CLI is installed
if command -v swa >/dev/null 2>&1; then
  echo -e "${YELLOW}Using SWA CLI...${NC}"

  # Get deployment token from environment or prompt
  if [ -z "$SWA_DEPLOYMENT_TOKEN" ]; then
    echo -e "${YELLOW}SWA_DEPLOYMENT_TOKEN not set. Please get token from Azure Portal:${NC}"
    echo "1. Go to Azure Portal"
    echo "2. Navigate to Static Web App 'apexcoachai'"
    echo "3. Click 'Manage deployment token'"
    echo "4. Copy the token"
    echo ""
    read -p "Enter deployment token: " SWA_DEPLOYMENT_TOKEN
  fi

  swa deploy ./dist \
    --deployment-token "$SWA_DEPLOYMENT_TOKEN" \
    --app-name apexcoachai
else
  echo -e "${YELLOW}SWA CLI not found. Install with: npm install -g @azure/static-web-apps-cli${NC}"
  echo -e "${YELLOW}Attempting deployment via Azure CLI...${NC}"

  # Login to Azure
  az account show >/dev/null 2>&1 || az login

  # Set subscription
  az account set --subscription 44e77ffe-2c39-4726-b6f0-2c733c7ffe78

  # Deploy using Azure CLI
  az staticwebapp deploy \
    --name apexcoachai \
    --resource-group rg-shared-web \
    --source ./dist \
    --no-wait
fi

# Navigate back to root
cd ../..

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo "Frontend URL: https://apexcoachai.shtrial.com"
echo ""
echo "Next steps:"
echo "1. Wait 1-2 minutes for deployment to propagate"
echo "2. Clear browser cache or use incognito mode"
echo "3. Test the application"
echo "4. Verify API connectivity"

# Optional: Test deployment
echo ""
read -p "Test deployment now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Testing frontend...${NC}"
  FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://apexcoachai.shtrial.com || echo "FAILED")
  if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Frontend is live${NC}"
  else
    echo -e "${RED}✗ Frontend test failed (status: $FRONTEND_STATUS)${NC}"
  fi
fi
