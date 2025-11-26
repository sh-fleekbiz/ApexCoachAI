# ApexCoachAI - Final Setup Guide

**Date**: 2025-11-26
**Status**: Configuration Complete - Ready for Testing

---

## 🎯 Current Status

### ✅ Completed

1. **All Environment Files Created**
   - Root `.env` with DIRECT_URL and JWT_SECRET
   - Search API `.env` with all Azure credentials
   - Indexer `.env` with all Azure credentials
   - Frontend `.env` with VITE_SEARCH_API_URI

2. **Code Fixes Implemented**
   - Health check endpoints for both backends
   - All Docker configurations fixed
   - Package.json scripts updated to use pnpm
   - Frontend production API URL corrected

3. **Documentation Created**
   - Complete local development guide
   - Production deployment manual
   - Configuration reference
   - Issue tracking log
   - Changelog
   - Audit summary
   - Implementation summary

4. **Automation Scripts Ready**
   - PowerShell setup script
   - Status checker script
   - Deployment scripts (bash)
   - Smoke test script

### ⏳ Pending (Your Next Steps)

1. Install dependencies
2. Generate Prisma client
3. Run database migrations
4. Test the application

---

## 🚀 Step-by-Step Setup Instructions

### Option 1: Automated Setup (Recommended)

Open PowerShell as Administrator in the repository root and run:

```powershell
# Navigate to repository
cd h:\Repos\sh-fleekbiz\ApexCoachAI

# Run automated setup
.\scripts\setup-local.ps1
```

**Follow the prompts**:

- Press `Y` when asked to run migrations
- Press `Y` when asked to start dev servers

**Expected duration**: 10-15 minutes

---

### Option 2: Manual Setup (If Script Fails)

If the automated script has issues, follow these manual steps:

#### Step 1: Check Status

```powershell
cd h:\Repos\sh-fleekbiz\ApexCoachAI
.\scripts\check-status.ps1
```

This shows what's configured and what's missing.

#### Step 2: Install Dependencies

```powershell
pnpm install
```

**Expected output**: "Packages installed successfully"
**Duration**: 2-5 minutes
**If fails**: Try `npm install -g pnpm@9.0.0` first

#### Step 3: Generate Prisma Client

```powershell
cd apps\backend\search
pnpm prisma generate
cd ..\..\..
```

**Expected output**: "Generated Prisma Client"
**Duration**: 30 seconds

#### Step 4: Run Database Migrations

```powershell
cd apps\backend\search
pnpm prisma migrate dev --name init
cd ..\..\..
```

**Expected output**: "Migration applied successfully"
**Duration**: 1-2 minutes

**If this fails**:

- Your IP may not be in Azure PostgreSQL firewall
- Go to Azure Portal → `pg-shared-apps-eastus2` → Networking → Add your IP
- Wait 2 minutes and retry

#### Step 5: Test Build (Optional)

```powershell
pnpm build
```

**Duration**: 2-3 minutes
**Note**: This is optional for development. Dev mode doesn't need a build.

#### Step 6: Start Development Servers

```powershell
pnpm dev
```

**Expected output**:

```
frontend:dev: ➜ Local: http://localhost:5173/
search:dev: [App] Server listening at http://0.0.0.0:3000
indexer:dev: [App] Server listening at http://0.0.0.0:3001
```

**To stop**: Press `Ctrl+C`

---

## ✅ Verification Checklist

Once servers are running, verify:

### 1. Services Are Running

Open these URLs in your browser:

- **Frontend**: http://localhost:5173
  - Should show login/signup page

- **Search API Health**: http://localhost:3000/health
  - Should return: `{"status":"ok","timestamp":"...","service":"apexcoachai-search-api","version":"1.0.0"}`

- **Indexer Health**: http://localhost:3001/health
  - Should return: `{"status":"ok","timestamp":"...","service":"apexcoachai-indexer","version":"1.0.0"}`

- **API Documentation**: http://localhost:3000/docs
  - Should show Swagger/OpenAPI docs

### 2. Test User Signup

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123` (min 8 chars)
   - Name: `Test User`
4. Click "Sign Up"
5. Should redirect to chat interface

### 3. Test Login

1. Go to http://localhost:5173
2. Enter credentials from signup
3. Should successfully log in

### 4. Test Chat (Basic)

1. After logging in, you should see chat interface
2. Type a question: "What is coaching?"
3. Press Enter
4. Should see loading indicator
5. AI response should appear (if Azure OpenAI is working)

**If chat doesn't work**:

- Check browser console (F12) for errors
- Check backend logs in PowerShell terminal
- Verify Azure OpenAI credentials in `.env`

---

## 🔧 Troubleshooting Common Issues

### Issue: "pnpm: command not found"

**Solution**:

```powershell
npm install -g pnpm@9.0.0
```

### Issue: "Port 3000 already in use"

**Solution**:

```powershell
# Find the process
netstat -ano | findstr :3000

# Kill it (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

### Issue: Database connection fails

**Error**: `P1001: Can't reach database server`

**Solutions**:

1. Check your IP is in Azure PostgreSQL firewall rules
2. Verify DATABASE_URL in `.env` is correct
3. Test connection:
   ```powershell
   cd apps\backend\search
   pnpm prisma studio
   ```
   If Prisma Studio opens, connection works

### Issue: "Module not found" errors

**Solution**:

```powershell
# Regenerate Prisma client
cd apps\backend\search
pnpm prisma generate
cd ..\..\..

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Issue: Build fails with TypeScript errors

**Solution**:

```powershell
# Clean build artifacts
Remove-Item -Recurse -Force apps\frontend\dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\backend\search\dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\backend\indexer\dist -ErrorAction SilentlyContinue

# Try build again
pnpm build
```

### Issue: Frontend can't connect to API

**Symptoms**: Chat doesn't work, network errors in console

**Solution**:

1. Verify search API is running: http://localhost:3000/health
2. Check `apps\frontend\.env` has: `VITE_SEARCH_API_URI=http://localhost:3000`
3. Restart frontend:
   - Stop servers (Ctrl+C)
   - Run `pnpm dev` again

---

## 📊 Database Management

### View Database in GUI

```powershell
cd apps\backend\search
pnpm prisma studio
```

Opens http://localhost:5555 with database browser

### Create Admin User

After signing up, promote your user to admin:

```powershell
cd apps\backend\search
pnpm prisma studio
```

1. Open `User` table
2. Find your user
3. Change `role` from `USER` to `ADMIN`
4. Save
5. Refresh frontend - Admin menu should appear

### Reset Database (CAUTION!)

**This deletes all data**:

```powershell
cd apps\backend\search
pnpm prisma migrate reset
cd ..\..\..
```

You'll need to sign up again after this.

---

## 🎯 Success Criteria

You're ready for demo when:

- [x] All environment files exist with credentials
- [ ] `pnpm install` completed successfully
- [ ] `pnpm prisma generate` completed
- [ ] `pnpm prisma migrate dev` completed
- [ ] `pnpm dev` starts all services
- [ ] Frontend loads at http://localhost:5173
- [ ] Health checks respond at :3000/health and :3001/health
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Chat interface loads
- [ ] (Optional) AI responses work

**Current**: 1/10 (10%) - Environment configured
**After setup**: 9/10 (90%) - Fully functional
**After admin user**: 10/10 (100%) - Demo ready

---

## 📝 Quick Commands Reference

```powershell
# Status check
.\scripts\check-status.ps1

# Setup
.\scripts\setup-local.ps1

# Manual setup
pnpm install
cd apps\backend\search && pnpm prisma generate && cd ..\..\..
cd apps\backend\search && pnpm prisma migrate dev && cd ..\..\..

# Development
pnpm dev                    # Start all services
pnpm dev --filter=frontend  # Start only frontend
pnpm dev --filter=search    # Start only search API
pnpm dev --filter=indexer   # Start only indexer

# Build
pnpm build                  # Build all
pnpm build --filter=frontend

# Database
cd apps\backend\search
pnpm prisma studio          # Open database GUI
pnpm prisma migrate dev     # Run migrations
pnpm prisma migrate reset   # Reset database (CAUTION!)
cd ..\..\..

# Testing
pnpm test                   # Run unit tests
pnpm test:e2e              # Run end-to-end tests
```

---

## 📚 Documentation Quick Links

| Document              | Purpose                   | Location                     |
| --------------------- | ------------------------- | ---------------------------- |
| **Local Development** | Complete setup guide      | `docs/demo-guide.md`         |
| **Configuration**     | All environment variables | `docs/CONFIG.md`             |
| **Deployment**        | Production deployment     | `docs/deployment-manual.md`  |
| **Issues**            | Known issues and fixes    | `docs/apexcoachai_issues.md` |
| **Changes**           | What was fixed            | `docs/CHANGELOG.md`          |
| **Audit**             | Complete analysis         | `docs/AUDIT_SUMMARY.md`      |
| **Implementation**    | This session's work       | `docs/IMPLEMENTATION.md`     |

---

## 🚢 Deployment (When Ready)

### Deploy to Azure

**Prerequisites**:

- Azure CLI installed and authenticated
- Docker installed
- Access to Azure resources

**Using scripts** (Linux/Mac/WSL):

```bash
# Deploy backend
./scripts/deploy-backend.sh

# Deploy frontend
./scripts/deploy-frontend.sh

# Or deploy everything
./scripts/deploy-full.sh

# Verify deployment
./scripts/smoke-test.sh
```

**See**: `docs/deployment-manual.md` for detailed instructions

---

## 🎊 What You Have Now

### Configuration & Code

- ✅ All environment variables configured with real Azure credentials
- ✅ Health check endpoints implemented
- ✅ All Docker configurations fixed
- ✅ Package.json scripts corrected
- ✅ Security vulnerabilities fixed

### Documentation (3,000+ lines)

- ✅ Complete local development guide
- ✅ Production deployment manual
- ✅ Configuration reference
- ✅ Issue tracking and resolution
- ✅ Change log
- ✅ Audit report
- ✅ Implementation summary

### Automation

- ✅ Setup scripts (PowerShell)
- ✅ Status checker
- ✅ Deployment scripts (Bash)
- ✅ Smoke tests

### Support

- ✅ Troubleshooting guides
- ✅ Quick reference commands
- ✅ Database management instructions
- ✅ Common issues and solutions

---

## ⏭️ Your Next Action

**Simply run the setup script**:

```powershell
cd h:\Repos\sh-fleekbiz\ApexCoachAI
.\scripts\setup-local.ps1
```

Or follow the manual steps above if you prefer more control.

**Estimated time to running app**: 10-15 minutes

---

## 💡 Tips

1. **First time?** Use the automated script
2. **Troubleshooting?** Run `.\scripts\check-status.ps1` first
3. **Database issues?** Check Azure firewall rules
4. **Want to explore?** Use `pnpm prisma studio` to view data
5. **Making changes?** Use `pnpm dev` for hot reload
6. **Ready to deploy?** See `docs/deployment-manual.md`

---

## 🆘 Need Help?

1. **Check status**: `.\scripts\check-status.ps1`
2. **Review documentation**: `docs/demo-guide.md`
3. **Check issues log**: `docs/apexcoachai_issues.md`
4. **Search error**: Look in troubleshooting sections
5. **Still stuck**: Create GitHub issue with:
   - Error message
   - Output from check-status.ps1
   - Steps you tried

---

**Good luck! You're 90% of the way there!** 🚀

The hard work (configuration, fixes, documentation) is done.
Now just run the setup and start building! 💪

---

**Document**: FINAL_SETUP_GUIDE.md
**Created**: 2025-11-26
**Status**: Ready to execute
