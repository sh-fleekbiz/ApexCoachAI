# Demo Login Deployment Guide

This guide walks through deploying the role-based demo login feature to production.

## Overview

The demo login feature provides three role-based demo accounts:

- **Admin Demo**: Full platform access with management capabilities
- **Coach Demo**: Content creator with programs and client interactions
- **Client Demo**: End-user experience with coaching sessions

## Prerequisites

- Access to Azure Portal or Azure CLI
- Database connection to `pg-shared-apps-eastus2` (database: `apex_db`)
- Backend environment variables configured

## Deployment Steps

### Step 1: Run Database Migration

Run the migration to add demo fields to the users table:

```bash
# Connect to Postgres database
psql "postgresql://username@pg-shared-apps-eastus2.postgres.database.azure.com/apex_db?sslmode=require"

# Run migration
\i apps/backend/search/migrations/001_add_demo_fields.sql
```

Or using Azure CLI:

```bash
az postgres flexible-server execute \
  --name pg-shared-apps-eastus2 \
  --admin-user <admin-username> \
  --database-name apex_db \
  --file-path apps/backend/search/migrations/001_add_demo_fields.sql
```

### Step 2: Seed Demo Users

Run the seed script to create the three demo user accounts:

```bash
cd apps/backend/search
node -r esbuild-register scripts/seedDemoUsers.ts
```

Or using tsx:

```bash
cd apps/backend/search
npx tsx scripts/seedDemoUsers.ts
```

This creates:

- `demo.admin@apexcoachai.com` (role: ADMIN, password: demo123)
- `demo.coach@apexcoachai.com` (role: COACH, password: demo123)
- `demo.client@apexcoachai.com` (role: USER, password: demo123)

### Step 3: Seed Demo Data

Run the seed script to populate realistic coaching data:

```bash
cd apps/backend/search
npx tsx scripts/seedDemoData.ts
```

This populates:

- **Coach Demo**: "Inside Out Marriage Transformation" program with 3 video resources
- **Client Demo**: 2 chat sessions with realistic marriage counseling conversations
- **Admin Demo**: Platform management activity logs

### Step 4: Enable Demo Login in Backend

Set the environment variable in your backend Container App:

**Via Azure Portal:**

1. Navigate to: Azure Portal → Container Apps → `apexcoachai-api`
2. Go to: Settings → Environment variables
3. Add: `ENABLE_DEMO_LOGIN` = `true`
4. Save and restart the app

**Via Azure CLI:**

```bash
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --set-env-vars ENABLE_DEMO_LOGIN=true
```

### Step 5: Deploy Frontend

Build and deploy the updated frontend with the new DemoLoginButtons component:

```bash
# From project root
pnpm install
pnpm build

# Deploy to Static Web App
az staticwebapp deploy \
  --name apexcoachai \
  --resource-group rg-shared-web \
  --app-location apps/frontend
```

### Step 6: Verify Deployment

1. Navigate to: https://apexcoachai.shtrial.com
2. You should see three demo role buttons on the login page:
   - **Admin Demo - Full Platform Access**
   - **Coach Demo - Content Creator Experience**
   - **Client Demo - End-User Journey**
3. Click each button to verify role-based login works correctly
4. First-time visitors should auto-login as Coach Demo

## Testing Checklist

- [ ] Migration applied successfully (verify demo columns exist in users table)
- [ ] Three demo users created with correct roles and flags
- [ ] Demo data populated (programs, chats, resources)
- [ ] Backend endpoint `/auth/demo-users` returns three roles
- [ ] Backend endpoint `/auth/demo-login` accepts role parameter
- [ ] Frontend displays three demo role buttons
- [ ] Each demo button logs in with correct user and navigates to dashboard
- [ ] Auto-login on first visit uses coach role
- [ ] User profile displays demo label when logged in as demo user

## API Endpoints

### GET /auth/demo-users

Returns available demo roles:

```json
{
  "demoUsers": [
    {
      "role": "admin",
      "label": "Admin Demo - Full Platform Access",
      "description": "Explore platform management, analytics, and system configuration"
    },
    {
      "role": "coach",
      "label": "Coach Demo - Content Creator Experience",
      "description": "Try creating programs, resources, and managing client interactions"
    },
    {
      "role": "client",
      "label": "Client Demo - End-User Journey",
      "description": "Experience the platform as a coaching client"
    }
  ]
}
```

### POST /auth/demo-login

Accepts optional role parameter:

```json
{
  "role": "coach"
}
```

Returns:

```json
{
  "user": {
    "id": 2,
    "email": "demo.coach@apexcoachai.com",
    "name": "Coach Demo",
    "role": "COACH",
    "isDemo": true,
    "demoRole": "coach",
    "demoLabel": "Coach Demo - Content Creator Experience"
  }
}
```

## Rollback Plan

If issues occur, disable demo login:

1. Set `ENABLE_DEMO_LOGIN=false` in Container App environment variables
2. Redeploy backend
3. Demo endpoints will return 404 errors
4. Frontend will gracefully handle unavailable demo roles

To completely remove demo data:

```sql
-- Remove demo users and cascade delete related data
DELETE FROM users WHERE is_demo = TRUE;

-- Optionally drop demo columns
ALTER TABLE users DROP COLUMN IF EXISTS is_demo;
ALTER TABLE users DROP COLUMN IF EXISTS demo_role;
ALTER TABLE users DROP COLUMN IF EXISTS demo_label;
```

## Security Considerations

1. **Demo accounts use weak passwords** (`demo123`) - acceptable since they're clearly marked as demo
2. **Demo flag prevents accidental data persistence** - backend can filter demo users from analytics
3. **ENABLE_DEMO_LOGIN guard** - prevents unauthorized access to demo endpoints in production
4. **No PII in demo data** - all demo data is fictional and non-sensitive

## Monitoring

After deployment, monitor:

1. **Demo login usage**:

   ```sql
   SELECT demo_role, COUNT(*)
   FROM usage_events
   WHERE user_id IN (SELECT id FROM users WHERE is_demo = TRUE)
   GROUP BY demo_role;
   ```

2. **Error rates** on `/auth/demo-login` and `/auth/demo-users` endpoints

3. **Frontend console logs** for DemoLoginButtons component errors

## Troubleshooting

### "Demo login unavailable" error

- Verify `ENABLE_DEMO_LOGIN=true` is set in backend Container App
- Check backend logs for startup errors
- Confirm backend is reachable at `https://api.apexcoachai.shtrial.com`

### "Failed to fetch demo roles" error

- Check CORS configuration allows frontend origin
- Verify `/auth/demo-users` endpoint returns 200
- Check network tab for failed requests

### Demo user not logging in

- Verify demo users exist in database: `SELECT * FROM users WHERE is_demo = TRUE`
- Check passwords are hashed correctly (bcrypt)
- Review backend logs for authentication errors

### Auto-login not working

- Clear localStorage and reload page
- Check browser console for errors in Login.tsx
- Verify `demoLoginWithRole('coach')` is being called

## Next Steps

After successful deployment:

1. **Add demo user analytics**: Track which demo roles are most popular
2. **Enhance demo data**: Add more realistic coaching scenarios
3. **Demo tours**: Guided walkthrough for each role
4. **Demo reset**: Allow users to reset demo data to initial state
5. **Multi-language**: Translate demo labels and descriptions

## Support

For issues or questions, contact the development team or file an issue in the repository.
