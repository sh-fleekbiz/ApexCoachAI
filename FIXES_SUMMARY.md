# ApexCoachAI Deployment Fixes Summary

## Date: November 29-30, 2025

### Issues Identified and Fixed

#### 1. CORS Configuration Issue ✅
**Problem:** Frontend was unable to communicate with backend API due to CORS errors.
- Error: "Access to fetch at 'https://api.apexcoachai.shtrial.com/meta-prompts' from origin 'https://apexcoachai.shtrial.com' has been blocked by CORS policy"

**Solution:**
- Registered the `cors` plugin in `apps/services/search/src/app.ts`
- Ensured `config` plugin is registered before `cors` (dependency requirement)
- CORS plugin was already installed but not registered in the application

**Files Modified:**
- `apps/services/search/src/app.ts` - Added CORS plugin registration

---

#### 2. Missing Route Registration ✅
**Problem:** Essential plugins and routes were not registered, causing incomplete functionality.

**Solution:**
- Registered all required plugins: `config`, `cors`, `prisma`, `database`, `auth`
- Registered all route handlers: `settings`, `me`, `chatApi`, `chats`, `library`, `admin`, `adminActionLogs`, `whiteLabel`

**Files Modified:**
- `apps/services/search/src/app.ts` - Added all plugin and route registrations

---

#### 3. Public Endpoint Authentication ✅
**Problem:** `/meta-prompts` endpoint required authentication, but frontend calls it before user login.

**Solution:**
- Removed `preHandler: [fastify.authenticate]` from the `/meta-prompts` route
- Made the endpoint publicly accessible for initial frontend load

**Files Modified:**
- `apps/services/search/src/routes/settings.ts` - Removed authentication requirement

---

#### 4. Chat API Request Format Mismatch ✅
**Problem:** Frontend `chat-component` sends `messages` array format, but backend only accepted `input` string format.
- Error: "body must have required property 'input'"

**Solution:**
- Updated backend schema to accept both `input` (string) and `messages` (array) formats
- Added logic to extract `input` from `messages` array if `input` is not provided
- Used `anyOf` in JSON schema to allow either format

**Files Modified:**
- `apps/services/search/src/routes/chat-api.ts` - Updated schema and handler to support both formats

---

#### 5. Database Role Constraint Violation ✅
**Problem:** Database expects uppercase role values (`USER`, `ASSISTANT`, `SYSTEM`), but code was using lowercase (`user`, `assistant`, `system`).
- Error: "new row for relation 'chat_messages' violates check constraint 'chat_messages_role_check'"

**Solution:**
- Convert role to uppercase when saving to database in `messageRepository.createMessage()`
- Convert role back to lowercase when reading from database in `getMessagesByChatId()` and `getRecentMessages()`
- Maintains TypeScript type consistency (lowercase) while satisfying database constraints (uppercase)

**Files Modified:**
- `apps/services/search/src/db/message-repository.ts` - Added role case conversion logic

---

#### 6. Error Handling Improvements ✅
**Problem:** `prepareChatContext` could return undefined or throw errors that weren't properly handled.

**Solution:**
- Added null check for `prepareChatContext` result
- Improved error handling in catch block to handle custom error objects with status codes

**Files Modified:**
- `apps/services/search/src/routes/chat-api.ts` - Added result validation and improved error handling

---

### Deployment Status

**Current Status:** All fixes have been implemented and deployed to Azure Container Registry. The container app is running revision `0000010`, but may need additional time to pull the latest image.

**Deployment Commands Used:**
```powershell
# Build and push image
pwsh scripts/deploy-backend.ps1

# Update container app
az containerapp update --name ca-apexcoachai-api --resource-group rg-shared-container-apps --image acrsharedapps.azurecr.io/apexcoachai-api:latest
```

---

### Testing Results

✅ Frontend loads successfully
✅ Authentication works (demo login)
✅ Meta-prompts endpoint accessible
✅ Chat creation works (chats are being created)
⚠️ Chat message processing - awaiting new revision deployment

---

### Next Steps

1. Wait for Azure Container Apps to fully deploy the new revision
2. Verify chat message processing works end-to-end
3. Test all features (library, settings, admin functions)
4. Monitor logs for any remaining issues

---

### Files Changed Summary

1. `apps/services/search/src/app.ts` - Plugin and route registration
2. `apps/services/search/src/routes/settings.ts` - Public meta-prompts endpoint
3. `apps/services/search/src/routes/chat-api.ts` - Request format compatibility and error handling
4. `apps/services/search/src/db/message-repository.ts` - Role case conversion

---

### Notes

- All code changes have been tested locally and compile successfully
- Docker images have been built and pushed to Azure Container Registry
- Container app updates may take a few minutes to propagate
- Revision `0000010` was created to force deployment of new code

