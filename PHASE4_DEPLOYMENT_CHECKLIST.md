# Phase 4 Deployment Checklist

## Pre-Deployment

### Database Migration

- [ ] Backup current database
- [ ] Run migration script:
  ```bash
  az postgres flexible-server execute \
    --name pg-shared-apps-eastus2 \
    --admin-user pgadmin \
    --database-name apexcoachai_db \
    --file-path apps/backend/search/migrations/002_create_knowledge_base_documents.sql
  ```
- [ ] Verify table created: `SELECT * FROM knowledge_base_documents LIMIT 1;`
- [ ] Verify indexes created: `\di knowledge_base_documents*`

### Backend Deployment

- [ ] Update Prisma schema (already updated in code)
- [ ] Run `pnpm install` to update dependencies
- [ ] Build backend: `pnpm build --filter=search`
- [ ] Test backend locally:
  - [ ] Test GET /admin/knowledge-base
  - [ ] Test POST /admin/knowledge-base
  - [ ] Test DELETE /admin/knowledge-base/:id
- [ ] Build Docker image:
  ```bash
  docker build -t shacrapps.azurecr.io/apexcoachai-api:v6 \
    -f apps/backend/search/Dockerfile.deploy .
  ```
- [ ] Push to ACR:
  ```bash
  docker push shacrapps.azurecr.io/apexcoachai-api:v6
  ```
- [ ] Update Container App:
  ```bash
  az containerapp update \
    --name apexcoachai-api \
    --resource-group rg-shared-apps \
    --image shacrapps.azurecr.io/apexcoachai-api:v6
  ```
- [ ] Verify deployment:
  ```bash
  az containerapp logs show \
    --name apexcoachai-api \
    --resource-group rg-shared-apps \
    --tail 30
  ```

### Frontend Deployment

- [ ] Build frontend: `pnpm build --filter=frontend`
- [ ] Verify build artifacts in `apps/frontend/dist/`
- [ ] Deploy to Azure Static Web Apps (automatic via CI/CD or manual)
- [ ] Verify deployed URL: https://[your-static-web-app].azurestaticapps.net

## Post-Deployment Testing

### Smoke Tests

- [ ] Navigate to /admin/knowledge-base
- [ ] Verify empty state shows if no documents
- [ ] Upload a test document (PDF or URL)
- [ ] Verify document appears in table
- [ ] Test search functionality
- [ ] Test status filter dropdown
- [ ] Select document and test bulk actions
- [ ] Delete test document

### Integration Tests

- [ ] Create document → appears in table
- [ ] Retrain document → status changes
- [ ] Assign program → program badge appears
- [ ] Delete document → removed from table
- [ ] Upload multiple files → all appear
- [ ] Bulk delete → all selected removed

### Performance Tests

- [ ] Upload 10+ documents → UI remains responsive
- [ ] Search with many results → fast response
- [ ] Polling doesn't cause lag (check browser console)

### Mobile Tests

- [ ] Test on mobile device or browser DevTools
- [ ] Table scrolls horizontally
- [ ] Upload modal fits screen
- [ ] Bulk actions bar responsive
- [ ] Stats cards stack vertically

## Rollback Plan (If Issues)

### Backend Rollback

```bash
# Revert to previous image
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --image shacrapps.azurecr.io/apexcoachai-api:v5
```

### Database Rollback

```sql
-- Drop table if needed
DROP TABLE IF EXISTS knowledge_base_documents;

-- Or just disable feature by returning empty array in repository
```

### Frontend Rollback

- Redeploy previous frontend build
- Or use Azure Static Web Apps deployment history

## Monitoring

### After Deployment (First 24 Hours)

- [ ] Monitor Container App logs for errors
- [ ] Check Application Insights for exceptions
- [ ] Monitor database query performance
- [ ] Track upload success rate
- [ ] Monitor API response times

### Metrics to Watch

- [ ] Knowledge base document count
- [ ] Upload success/failure rate
- [ ] Training job completion time
- [ ] API endpoint latency
- [ ] Frontend error rate

## Known Limitations (TODO)

1. **File Upload**: Currently uses basic fetch() - no progress tracking
   - Future: Implement XHR with progress events
2. **Training Jobs**: Status set to "training" but actual job needs implementation
   - Future: Integrate with Azure Functions or background worker
3. **Document Preview**: No preview modal yet
   - Future: Add document preview with metadata display
4. **WebSocket**: Using polling instead of WebSocket for real-time updates
   - Future: Implement WebSocket for instant updates

## Success Criteria

✅ All endpoints return 200 OK
✅ Documents can be created via UI
✅ Documents appear in table
✅ Search and filters work
✅ Bulk actions work
✅ No console errors
✅ Mobile responsive
✅ Admin action logs created

## Sign-Off

- [ ] Backend deployment successful
- [ ] Frontend deployment successful
- [ ] Database migration complete
- [ ] Smoke tests passed
- [ ] Integration tests passed
- [ ] Mobile tests passed
- [ ] Monitoring configured
- [ ] Team notified

**Deployment Date**: ********\_********
**Deployed By**: ********\_********
**Version**: v6 (Phase 4)
**Notes**: ********\_********
