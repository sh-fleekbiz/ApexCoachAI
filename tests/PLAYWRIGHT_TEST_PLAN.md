# Playwright Test Plan - Apex Coach AI

## 1. Architecture Summary

**Apex Coach AI** is an AI-powered coaching and development platform that transforms proprietary content into interactive AI coaching experts. The application is a full-stack monorepo with:

### Frontend Stack

- **Framework**: React 18 with TypeScript (Vite-based SPA)
- **UI Library**: Fluent UI React components
- **Routing**: React Router DOM v6
- **State Management**: React Context (AuthContext, PersonalityContext)
- **Custom Component**: `chat-component` (Web Component for chat interactions)
- **Base URL**: `http://localhost:5173`

### Backend Stack

- **Framework**: Fastify (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **AI Services**: Azure OpenAI (GPT-4o, embeddings)
- **Search**: Postgres + pgvector (vector search with optional text filters)
- **Authentication**: JWT tokens via HTTP-only cookies
- **API Base URL**: `http://localhost:3000` (via proxy)

### Key User Roles / Personas

1. **Admin**: Full platform access - manage users, personalities, programs, knowledge base
2. **Coach**: Guide clients through coaching programs
3. **Client**: Experience the AI coaching journey

### Core Features ("Money Paths")

1. **Demo Login Flow**: Role-based instant access (coach/client/admin)
2. **AI Chat**: RAG-powered coaching conversations with streaming responses
3. **Personality Selection**: Custom AI coaching personas
4. **Content Library**: Video/document management with transcription & indexing
5. **Admin Panel**: User management, analytics, system configuration
6. **Settings**: Developer options, theme switching, chat customization

### External Dependencies

- Azure OpenAI (GPT-4o for chat, embeddings for RAG)
- Postgres + pgvector (vector search and retrieval; no external search service)
- Azure Blob Storage (content files)
- PostgreSQL Database (users, chats, messages, resources)

---

## 2. Existing Test Coverage Analysis

### Current E2E Tests

| File                    | Coverage                                                                     | Gaps                                            |
| ----------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| `webapp.spec.ts`        | Chat interaction, ask mode, chat history, error handling, developer settings | No auth flow, no admin panel, no library        |
| `comprehensive.spec.ts` | Functional tests, visual snapshots, cross-browser                            | Missing auth, admin, library, personality tests |
| `extended.spec.ts`      | Mobile/tablet/desktop layouts, functional tests, error handling              | Duplicate coverage, missing new features        |

### Identified Gaps

- ❌ **Authentication flow** (demo login with role selection)
- ❌ **Admin panel** (users, personalities, programs, knowledge base)
- ❌ **Content Library** (upload, browse, view resources)
- ❌ **Personality selection** (coaching persona switching)
- ❌ **Protected routes** (route guards, unauthorized access)
- ❌ **API integration tests** (backend endpoints via UI)
- ❌ **Negative scenarios** (network failures, permission denials)

---

## 3. Test Environment

### Base URLs

- **Frontend**: `http://localhost:5173`
- **Backend API**: Proxied through frontend or `http://localhost:3000`

### Test Accounts (Demo Login)

| Role   | Demo Role Key | Access Level         |
| ------ | ------------- | -------------------- |
| Admin  | `admin`       | Full platform access |
| Coach  | `coach`       | Coaching features    |
| Client | `client`      | Client-side features |

### Feature Flags

- `ENABLE_DEMO_LOGIN=true` - Required for demo login tests

### HAR Files (Mock Responses)

- `tests/e2e/hars/chat-response.har` - Chat API mock
- `tests/e2e/hars/ask-response.har` - Ask API mock
- `tests/e2e/hars/citation-content.har` - Citation content mock

---

## 4. Test Inventory

### Priority Legend

- **P0**: Critical path - business-critical, blocks release if broken
- **P1**: Major - important features, should pass before release
- **P2**: Nice-to-have - edge cases, polish, accessibility

### Authentication Tests

| ID      | Title                        | User Role | Priority | Type       | File           |
| ------- | ---------------------------- | --------- | -------- | ---------- | -------------- |
| AUTH-01 | Demo login with Admin role   | Guest     | P0       | Smoke      | `auth.spec.ts` |
| AUTH-02 | Demo login with Coach role   | Guest     | P0       | Smoke      | `auth.spec.ts` |
| AUTH-03 | Demo login with Client role  | Guest     | P0       | Smoke      | `auth.spec.ts` |
| AUTH-04 | Login page renders correctly | Guest     | P1       | Visual     | `auth.spec.ts` |
| AUTH-05 | Login error handling         | Guest     | P1       | Edge       | `auth.spec.ts` |
| AUTH-06 | Logout functionality         | All       | P1       | Regression | `auth.spec.ts` |
| AUTH-07 | Protected route redirect     | Guest     | P0       | Smoke      | `auth.spec.ts` |

### Chat Tests

| ID      | Title                                | User Role | Priority | Type       | File           |
| ------- | ------------------------------------ | --------- | -------- | ---------- | -------------- |
| CHAT-01 | Send message and receive AI response | Client    | P0       | Smoke      | `chat.spec.ts` |
| CHAT-02 | Streaming chat response              | Client    | P0       | Smoke      | `chat.spec.ts` |
| CHAT-03 | Chat with personality selection      | Client    | P1       | Regression | `chat.spec.ts` |
| CHAT-04 | Starter prompts click handling       | Client    | P1       | Regression | `chat.spec.ts` |
| CHAT-05 | Chat history persistence             | Client    | P1       | Regression | `chat.spec.ts` |
| CHAT-06 | Citations display and navigation     | Client    | P1       | Regression | `chat.spec.ts` |
| CHAT-07 | Server error handling                | Client    | P1       | Edge       | `chat.spec.ts` |
| CHAT-08 | Content filter handling              | Client    | P1       | Edge       | `chat.spec.ts` |
| CHAT-09 | Empty message validation             | Client    | P2       | Edge       | `chat.spec.ts` |
| CHAT-10 | RAG visualization during response    | Client    | P2       | Visual     | `chat.spec.ts` |

### Admin Panel Tests

| ID       | Title                        | User Role | Priority | Type       | File            |
| -------- | ---------------------------- | --------- | -------- | ---------- | --------------- |
| ADMIN-01 | Admin panel access control   | Admin     | P0       | Smoke      | `admin.spec.ts` |
| ADMIN-02 | Non-admin access denied      | Client    | P0       | Edge       | `admin.spec.ts` |
| ADMIN-03 | View users list              | Admin     | P1       | Regression | `admin.spec.ts` |
| ADMIN-04 | View personalities list      | Admin     | P1       | Regression | `admin.spec.ts` |
| ADMIN-05 | View programs list           | Admin     | P1       | Regression | `admin.spec.ts` |
| ADMIN-06 | View knowledge base overview | Admin     | P1       | Regression | `admin.spec.ts` |
| ADMIN-07 | Tab navigation               | Admin     | P2       | UX         | `admin.spec.ts` |

### Library Tests

| ID     | Title                        | User Role | Priority | Type       | File              |
| ------ | ---------------------------- | --------- | -------- | ---------- | ----------------- |
| LIB-01 | Browse content library       | Client    | P1       | Smoke      | `library.spec.ts` |
| LIB-02 | Search library resources     | Client    | P1       | Regression | `library.spec.ts` |
| LIB-03 | Filter by status             | Client    | P2       | Regression | `library.spec.ts` |
| LIB-04 | View resource details        | Client    | P1       | Regression | `library.spec.ts` |
| LIB-05 | Upload resource (admin only) | Admin     | P1       | Regression | `library.spec.ts` |
| LIB-06 | Grid/list view toggle        | Client    | P2       | UX         | `library.spec.ts` |

### Visual / Responsive Tests

| ID     | Title                   | User Role | Priority | Type   | File             |
| ------ | ----------------------- | --------- | -------- | ------ | ---------------- |
| VIS-01 | Mobile layout (375px)   | Client    | P1       | Visual | `visual.spec.ts` |
| VIS-02 | Tablet layout (768px)   | Client    | P2       | Visual | `visual.spec.ts` |
| VIS-03 | Desktop layout (1920px) | Client    | P2       | Visual | `visual.spec.ts` |
| VIS-04 | Dark theme rendering    | Client    | P2       | Visual | `visual.spec.ts` |
| VIS-05 | Login page responsive   | Guest     | P1       | Visual | `visual.spec.ts` |

---

## 5. Representative Scenarios (P0/P1 Detailed)

### AUTH-01: Demo Login with Admin Role

**Preconditions:**

- App running at `http://localhost:5173`
- Backend API available
- `ENABLE_DEMO_LOGIN=true`
- User is not logged in

**Steps:**

1. Navigate to `/login`
2. Verify login page displays role selection buttons
3. Click the "Admin" demo login button
4. Wait for navigation to complete

**Expected Results:**

- Login page shows 3 demo role buttons (Coach, Client, Admin)
- After clicking Admin, user is redirected to `/` (home)
- User session is established (cookie set)
- User has admin role in context

---

### CHAT-01: Send Message and Receive AI Response

**Preconditions:**

- User logged in as any role
- On chat page (`/`)
- Backend API mocked or available

**Steps:**

1. Navigate to chat page (if not already there)
2. Enter a message in the chat input field
3. Click submit button or press Enter
4. Wait for AI response to complete

**Expected Results:**

- Message appears in chat history as user message
- Loading indicator shows during response
- AI response streams in with formatted content
- "Show thought process" button becomes enabled
- Chat input is re-enabled after response

---

### ADMIN-01: Admin Panel Access Control

**Preconditions:**

- User logged in as Admin role

**Steps:**

1. Navigate to `/admin`
2. Verify admin panel loads
3. Check all tabs are accessible

**Expected Results:**

- Admin panel header displays "⚙️ Admin Panel"
- Overview tab shows system statistics
- Users, Personalities, Programs, Knowledge Base tabs are visible
- No access denied errors

---

### ADMIN-02: Non-Admin Access Denied

**Preconditions:**

- User logged in as Client role

**Steps:**

1. Attempt to navigate directly to `/admin`

**Expected Results:**

- User is redirected to home or shown access denied
- Admin panel content is not visible

---

## 6. Execution Strategy

### Local Development

```bash
# Install dependencies
pnpm install

# Start frontend dev server
cd apps/frontend && pnpm dev

# Start backend server (separate terminal)
cd apps/backend/search && pnpm dev

# Run all Playwright tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run with specific browser
npx playwright test --project=chromium-desktop

# Run in headed mode for debugging
npx playwright test --headed

# Run with UI mode
npx playwright test --ui
```

### MCP Tool Integration

The `playwright` MCP tools can be used for:

1. **Rapid Exploration**: Use `playwright_navigate`, `playwright_click`, `playwright_fill` to manually walk through flows
2. **Visual Validation**: Capture screenshots with `playwright_screenshot` to verify UI state
3. **Network Inspection**: Monitor API responses during test development
4. **Ad-hoc Regression**: Quick validation of specific flows without running full test suite

### CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Run Playwright Tests
  run: npx playwright test
  env:
    CI: true
```

---

## 7. Test File Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts          # Authentication flows (NEW)
│   ├── chat.spec.ts          # Chat interactions (NEW, consolidates existing)
│   ├── admin.spec.ts         # Admin panel tests (NEW)
│   ├── library.spec.ts       # Content library tests (NEW)
│   ├── visual.spec.ts        # Visual/responsive tests (NEW)
│   ├── webapp.spec.ts        # Existing - legacy tests
│   ├── comprehensive.spec.ts # Existing - to be deprecated
│   ├── extended.spec.ts      # Existing - to be deprecated
│   └── hars/                 # HAR files for API mocking
├── PLAYWRIGHT_TEST_PLAN.md   # This document
└── fixtures/                 # Shared test fixtures (future)
```

---

## 8. Implementation Priority

### Phase 1 (P0 - Must Have)

1. `auth.spec.ts` - AUTH-01, AUTH-02, AUTH-03, AUTH-07
2. `chat.spec.ts` - CHAT-01, CHAT-02

### Phase 2 (P1 - Should Have)

3. `admin.spec.ts` - ADMIN-01, ADMIN-02, ADMIN-03
4. `library.spec.ts` - LIB-01, LIB-04
5. `visual.spec.ts` - VIS-01, VIS-05

### Phase 3 (P2 - Nice to Have)

6. Remaining edge cases and UX tests
7. Cross-browser validation
8. Performance benchmarks

---

## 9. Notes & Assumptions

1. **Demo login is enabled** in the test environment
2. **Backend API is running** or mocked via HAR files
3. **Database has demo users** seeded for each role
4. **Tests run against localhost** (not production)
5. **Parallel execution** is supported for independent tests
6. **Visual snapshots** may need baseline updates across environments
