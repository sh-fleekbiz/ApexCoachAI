#!/bin/bash
set -e

# ApexCoachAI Backend Deployment Script
# Builds and deploys backend services to Azure Container Apps

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ACR_NAME="acrsharedapps"
RESOURCE_GROUP="rg-shared-container-apps"
LOCATION="eastus2"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ApexCoachAI Backend Deployment ===${NC}"
echo "Timestamp: $TIMESTAMP"
echo "ACR: $ACR_NAME.azurecr.io"
echo "Resource Group: $RESOURCE_GROUP"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v az >/dev/null 2>&1 || { echo -e "${RED}Azure CLI is required but not installed.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed.${NC}" >&2; exit 1; }

# Login to Azure
echo -e "${YELLOW}Logging in to Azure...${NC}"
az account show >/dev/null 2>&1 || az login

# Set subscription
az account set --subscription 44e77ffe-2c39-4726-b6f0-2c733c7ffe78

# Login to ACR
echo -e "${YELLOW}Logging in to Azure Container Registry...${NC}"
az acr login --name $ACR_NAME

# Build and push search API
echo -e "${GREEN}Building search API image...${NC}"
docker build \
  --file apps/services/search/Dockerfile \
  --tag $ACR_NAME.azurecr.io/apexcoachai-api:latest \
  --tag $ACR_NAME.azurecr.io/apexcoachai-api:$TIMESTAMP \
  --platform linux/amd64 \
  .

echo -e "${GREEN}Pushing search API image...${NC}"
docker push $ACR_NAME.azurecr.io/apexcoachai-api:latest
docker push $ACR_NAME.azurecr.io/apexcoachai-api:$TIMESTAMP

# Build and push indexer
echo -e "${GREEN}Building indexer image...${NC}"
docker build \
  --file apps/services/indexer/Dockerfile \
  --tag $ACR_NAME.azurecr.io/apexcoachai-indexer:latest \
  --tag $ACR_NAME.azurecr.io/apexcoachai-indexer:$TIMESTAMP \
  --platform linux/amd64 \
  .

echo -e "${GREEN}Pushing indexer image...${NC}"
docker push $ACR_NAME.azurecr.io/apexcoachai-indexer:latest
docker push $ACR_NAME.azurecr.io/apexcoachai-indexer:$TIMESTAMP

# Update Container Apps
echo -e "${GREEN}Updating search API container app...${NC}"
az containerapp update \
  --name apexcoachai-api \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/apexcoachai-api:latest

echo -e "${GREEN}Updating indexer container app...${NC}"
az containerapp update \
  --name apexcoachai-indexer \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/apexcoachai-indexer:latest

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
echo "Waiting for services to be ready..."
sleep 10

# Test search API health
echo -e "${YELLOW}Testing search API health...${NC}"
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://api.apexcoachai.shtrial.com/health || echo "FAILED")
if [ "$API_HEALTH" = "200" ]; then
  echo -e "${GREEN}✓ Search API is healthy${NC}"
else
  echo -e "${RED}✗ Search API health check failed (status: $API_HEALTH)${NC}"
fi

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo "Search API: https://api.apexcoachai.shtrial.com"
echo "Indexer: Internal service (port 3001)"
echo "Image tags: latest, $TIMESTAMP"
echo ""
echo "Next steps:"
echo "1. Check Container App logs in Azure Portal"
echo "2. Test API endpoints"
echo "3. Verify frontend connectivity"
echo "4. Run smoke tests"
