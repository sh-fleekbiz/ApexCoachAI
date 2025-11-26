#!/bin/bash
set -e

# ApexCoachAI Full Deployment Script
# Deploys both backend and frontend services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ApexCoachAI Full Deployment ===${NC}"
echo "This will deploy both backend and frontend services"
echo ""

# Confirmation prompt
read -p "Continue with full deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Deployment cancelled"
  exit 0
fi

# Deploy backend
echo -e "${GREEN}Step 1/2: Deploying backend services...${NC}"
./scripts/deploy-backend.sh

# Wait between deployments
echo ""
echo -e "${YELLOW}Waiting 30 seconds before frontend deployment...${NC}"
sleep 30

# Deploy frontend
echo -e "${GREEN}Step 2/2: Deploying frontend...${NC}"
./scripts/deploy-frontend.sh

# Final summary
echo ""
echo -e "${GREEN}=== Full Deployment Complete ===${NC}"
echo ""
echo "Deployment Summary:"
echo "  Backend API:  https://api.apexcoachai.shtrial.com"
echo "  Frontend:     https://apexcoachai.shtrial.com"
echo "  API Docs:     https://api.apexcoachai.shtrial.com/docs"
echo ""
echo "Recommended next steps:"
echo "1. Run smoke tests: ./scripts/smoke-test.sh"
echo "2. Monitor Application Insights for errors"
echo "3. Check Container App logs in Azure Portal"
echo "4. Test core user flows (signup, chat, admin panel)"
