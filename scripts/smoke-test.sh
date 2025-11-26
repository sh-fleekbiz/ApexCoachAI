#!/bin/bash
set -e

# ApexCoachAI Smoke Test Script
# Quick validation of deployed services

API_URL="https://api.apexcoachai.shtrial.com"
FRONTEND_URL="https://apexcoachai.shtrial.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== ApexCoachAI Smoke Tests ===${NC}"
echo ""

PASSED=0
FAILED=0

# Test 1: API Health
echo -e "${YELLOW}Test 1: API Health Check${NC}"
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health" 2>/dev/null || echo "000")
if [ "$HEALTH_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - API health check returned 200"
  ((PASSED++))
else
  echo -e "${RED}✗ FAILED${NC} - API health check returned $HEALTH_STATUS"
  ((FAILED++))
fi
echo ""

# Test 2: API Documentation
echo -e "${YELLOW}Test 2: API Documentation${NC}"
DOCS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/docs" 2>/dev/null || echo "000")
if [ "$DOCS_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - API docs accessible"
  ((PASSED++))
else
  echo -e "${RED}✗ FAILED${NC} - API docs returned $DOCS_STATUS"
  ((FAILED++))
fi
echo ""

# Test 3: Frontend Loads
echo -e "${YELLOW}Test 3: Frontend Loads${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null || echo "000")
if [ "$FRONTEND_STATUS" = "200" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - Frontend loads successfully"
  ((PASSED++))
else
  echo -e "${RED}✗ FAILED${NC} - Frontend returned $FRONTEND_STATUS"
  ((FAILED++))
fi
echo ""

# Test 4: API CORS Headers
echo -e "${YELLOW}Test 4: API CORS Headers${NC}"
CORS_HEADER=$(curl -s -I "$API_URL/health" | grep -i "access-control-allow-origin" || echo "")
if [ -n "$CORS_HEADER" ]; then
  echo -e "${GREEN}✓ PASSED${NC} - CORS headers present"
  ((PASSED++))
else
  echo -e "${RED}✗ FAILED${NC} - CORS headers missing (may cause frontend issues)"
  ((FAILED++))
fi
echo ""

# Test 5: API Response Time
echo -e "${YELLOW}Test 5: API Response Time${NC}"
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$API_URL/health" 2>/dev/null || echo "0")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
if (( $(echo "$RESPONSE_TIME < 2" | bc -l) )); then
  echo -e "${GREEN}✓ PASSED${NC} - API responded in ${RESPONSE_TIME_MS}ms"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠ WARNING${NC} - API responded in ${RESPONSE_TIME_MS}ms (slow)"
  ((PASSED++))
fi
echo ""

# Summary
echo -e "${GREEN}=== Test Summary ===${NC}"
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total:  $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All smoke tests passed! ✓${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please investigate.${NC}"
  exit 1
fi
