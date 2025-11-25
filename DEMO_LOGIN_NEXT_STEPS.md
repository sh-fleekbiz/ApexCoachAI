# Demo Login Feature - Next Steps

## ✅ Completed

- [x] Backend migrated from SQLite to Azure Postgres
- [x] Demo user schema and migration created
- [x] Demo user and data seed scripts implemented
- [x] Backend demo login routes added
- [x] Frontend AuthContext extended with role-based login
- [x] DemoLoginButtons component created
- [x] Login page updated with demo role selection
- [x] All packages built successfully

## 🚀 Ready for Deployment

### Step 1: Run Database Migration

You need to run the migration against your Azure Postgres database:

```bash
# Option 1: Using psql (if you have it installed)
psql "postgresql://username@pg-shared-apps-eastus2.postgres.database.azure.com/apexcoachai_db?sslmode=require" \
  -f apps/backend/search/migrations/001_add_demo_fields.sql

# Option 2: Using Azure CLI
az postgres flexible-server execute \
  --name pg-shared-apps-eastus2 \
  --admin-user <your-admin-username> \
  --database-name apexcoachai_db \
  --file-path apps/backend/search/migrations/001_add_demo_fields.sql
```

**Migration contents:**

- Adds `is_demo`, `demo_role`, `demo_label` columns to users table
- Creates index for efficient demo user queries
- Uses `IF NOT EXISTS` for safe re-runs

### Step 2: Seed Demo Users

Run the seed script to create the three demo accounts:

```bash
cd apps/backend/search
npx tsx scripts/seedDemoUsers.ts
```

**What this creates:**

- `demo.admin@apexcoachai.com` - Admin Demo (password: demo123)
- `demo.coach@apexcoachai.com` - Coach Demo (password: demo123)
- `demo.client@apexcoachai.com` - Client Demo (password: demo123)

**Note:** Script uses `INSERT ... ON CONFLICT` so it's safe to run multiple times.

### Step 3: Seed Demo Data

Populate realistic coaching data for the demo accounts:

```bash
cd apps/backend/search
npx tsx scripts/seedDemoData.ts
```

**What this creates:**

- Coach program: "Inside Out Marriage Transformation" (12-week program)
- 3 video resources about emotional triggers and relationship coaching
- 2 chat sessions for the client demo with realistic conversations
- Admin activity logs
- User settings (nicknames, occupations)

### Step 4: Configure Backend Environment

Set the environment variable to enable demo login:

**For local development (`.env` file):**

```bash
ENABLE_DEMO_LOGIN=true
```

**For Azure Container App (Production):**

Via Azure Portal:

1. Navigate to: Container Apps → `apexcoachai-api`
2. Go to: Settings → Environment variables
3. Add: `ENABLE_DEMO_LOGIN` = `true`
4. Save and restart

Via Azure CLI:

```bash
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --set-env-vars ENABLE_DEMO_LOGIN=true
```

### Step 5: Test Locally (Optional but Recommended)

Before deploying to production, test locally:

```bash
# Terminal 1: Start backend
cd apps/backend/search
pnpm dev

# Terminal 2: Start frontend
cd apps/frontend
pnpm dev
```

Then test:

1. Open http://localhost:5173
2. Verify three demo role buttons appear
3. Click each button to test role-based login
4. Verify navigation to dashboard
5. Check user profile shows demo label

### Step 6: Deploy to Production

**Deploy Backend:**

```bash
# Build backend Docker image
cd apps/backend/search
docker build -t apexcoachai-search:latest -f Dockerfile ../..

# Tag and push to Azure Container Registry
docker tag apexcoachai-search:latest shacrapps.azurecr.io/apexcoachai-search:latest
az acr login --name shacrapps
docker push shacrapps.azurecr.io/apexcoachai-search:latest

# Update Container App
az containerapp update \
  --name apexcoachai-api \
  --resource-group rg-shared-apps \
  --image shacrapps.azurecr.io/apexcoachai-search:latest
```

**Deploy Frontend:**

```bash
# Build and deploy to Static Web App
pnpm build

az staticwebapp deploy \
  --name apexcoachai \
  --resource-group rg-shared-web \
  --app-location apps/frontend/dist
```

### Step 7: Production Verification

After deployment, verify everything works:

1. **Navigate to:** https://apexcoachai.shtrial.com
2. **Check Login Page:**
   - [ ] Three demo role buttons visible
   - [ ] Buttons have proper labels and descriptions
   - [ ] "or" separator displayed correctly
3. **Test Each Demo Role:**
   - [ ] Admin Demo button logs in successfully
   - [ ] Coach Demo button logs in successfully
   - [ ] Client Demo button logs in successfully
   - [ ] Each role navigates to appropriate dashboard
4. **Verify Auto-Login:**
   - [ ] Clear localStorage and reload page
   - [ ] Should auto-login as Coach Demo on first visit
5. **Test API Endpoints:**

   ```bash
   # Test demo-users endpoint
   curl https://api.apexcoachai.shtrial.com/auth/demo-users

   # Test demo-login endpoint
   curl -X POST https://api.apexcoachai.shtrial.com/auth/demo-login \
     -H "Content-Type: application/json" \
     -d '{"role":"coach"}'
   ```

## 🧪 Testing Checklist

- [ ] Migration runs without errors
- [ ] Three demo users created in database
- [ ] Demo data populated correctly
- [ ] GET /auth/demo-users returns 3 roles
- [ ] POST /auth/demo-login works with each role
- [ ] Frontend displays demo buttons
- [ ] Each button logs in with correct role
- [ ] User profile shows demo metadata
- [ ] Auto-login uses coach role
- [ ] Error handling works (e.g., ENABLE_DEMO_LOGIN=false)

## 📊 Monitoring

After deployment, monitor:

1. **Demo Login Usage:**

   ```sql
   SELECT demo_role, COUNT(*) as logins
   FROM users u
   JOIN usage_events e ON u.id = e.user_id
   WHERE u.is_demo = TRUE
   GROUP BY demo_role;
   ```

2. **Error Rates:**
   - Check Application Insights for `/auth/demo-login` errors
   - Monitor `/auth/demo-users` response times

3. **User Feedback:**
   - Track which demo role is most popular
   - Monitor session duration for demo users

## 🔄 Rollback Plan

If issues occur:

1. **Disable Feature:**

   ```bash
   az containerapp update \
     --name apexcoachai-api \
     --resource-group rg-shared-apps \
     --set-env-vars ENABLE_DEMO_LOGIN=false
   ```

2. **Remove Demo Data (if needed):**

   ```sql
   DELETE FROM users WHERE is_demo = TRUE;
   ```

3. **Revert Frontend:**
   - Redeploy previous Static Web App build
   - Frontend will handle missing demo endpoints gracefully

## 📝 Documentation

Detailed documentation available at:

- **Deployment Guide:** `docs/DEMO_LOGIN_DEPLOYMENT.md`
- **Implementation Summary:** `docs/DEMO_LOGIN_SUMMARY.md`
- **Configuration:** `docs/CONFIG.md`

## 🎯 Success Criteria

The feature is successfully deployed when:

- ✅ All three demo roles are accessible
- ✅ Demo data is visible in each role's dashboard
- ✅ Auto-login works on first visit
- ✅ No console errors in browser
- ✅ Backend endpoints respond within 500ms
- ✅ User experience is smooth and intuitive

## 🔮 Future Enhancements

Consider these improvements after initial deployment:

- Demo data reset functionality
- Guided tours for each role
- Multi-language support for demo labels
- Analytics dashboard for demo usage
- Time-limited demo sessions
- In-app role switching
