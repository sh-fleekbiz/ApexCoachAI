# Apex Coach AI Development Roadmap

**Based on**: Product Requirements Document (PRD)  
**Last Updated**: November 21, 2025

---

## Roadmap Overview

Apex Coach AI development follows the three-phase approach defined in the PRD, focusing on building a "Content-as-a-Service" platform for coaches and course creators.

---

## Phase 1: AI Expert Core & Security MVP ✅ (75% Complete)

**Goal**: Coach can upload, index content, chat securely, and assign initial roles.

### ✅ Completed

- **Video Indexing Pipeline**: Basic document indexer exists, can be extended for video/audio
- **Authentication & RBAC**: JWT-based auth with Owner/Admin/Coach/User roles
- **Database Schema**: SQLite with all required tables (users, chats, programs, assignments, etc.)
- **Chat Persistence**: Multi-chat system with message history
- **Personality System**: Meta-prompts for different coaching styles
- **Basic Library UI**: Knowledge base management interface exists

### 🚧 In Progress

- **Speaker-Aware RAG Logic**: Database schema ready (speaker_meta_json), needs implementation
- **Program Assignment Security**: Database tables exist, RBAC enforcement needs completion
- **Frontend Persistence**: Chat UI connected to backend, needs refinement

### ❌ Not Started

- **Video Transcription**: Azure AI Speech integration for transcription + speaker diarization
- **Advanced RBAC Filtering**: Enforce program-based content access in RAG retrieval

**Target**: Complete remaining items before moving to Phase 2

---

## Phase 2: Monetization & Structure (Planned - Q1 2026)

**Goal**: Coach can create tiered programs and manage client access effectively.

### Planned Features

1. **Program Management UI**
   - Create/edit/delete programs
   - Assign content folders to programs
   - Set access levels and permissions

2. **Advanced RBAC/Program Filtering**
   - Users can only query content from assigned programs
   - RAG retrieval filtered by program membership
   - Cross-program isolation

3. **User/Coach Assignment UI**
   - Assign users to programs
   - Assign coaches to programs
   - Manage participant roles

4. **Enrollment System**
   - Generate invitation links per program
   - Email invitation system
   - Invitation code redemption

### Prerequisites

- Phase 1 RBAC enforcement complete
- Admin console fully functional
- Testing framework in place

**Target**: Q1 2026

---

## Phase 3: Client Experience Polish & Enterprise (Planned - Q2 2026)

**Goal**: Premium client experience and branding features are deployed.

### Planned Features

1. **Citation-Linked Video Player Overlay**
   - Video player modal/slide-over
   - Click citation to jump to exact timestamp
   - Inline video playback in chat

2. **White-Label Branding Settings**
   - Upload custom logo
   - Set brand colors
   - Configure application name
   - Custom CSS injection
   - Database schema already implemented ✅

3. **User Data Export**
   - Export user data per program
   - Export chat history logs
   - GDPR compliance features

4. **Onboarding Tour**
   - Welcome screen for new users
   - Guided overlay highlighting Library, Chat, Persona features
   - Skip/replay functionality

5. **Admin Action Logging**
   - Log all critical admin actions
   - Audit trail viewer in admin console
   - Database schema already implemented ✅
   - Filters by action type, user, date range

### Prerequisites

- Phase 2 program management complete
- Video transcription and player working
- Performance optimizations done

**Target**: Q2 2026

---

## Future Phases (Beyond Q2 2026)

### Phase 4: Voice & Mobile

- **Voice Input**: Speech-to-text for chat input (Azure AI Speech)
- **Voice Output**: Text-to-speech for responses
- **React Native Mobile App**: iOS and Android native apps
- **Push Notifications**: Reminders and insights
- **Offline Mode**: Sync when online

### Phase 5: Advanced Features

- **Multi-language Support**: i18n for global reach
- **Team/Organization Features**: Multi-user workspaces
- **Calendar Integration**: Connect with productivity tools
- **Advanced Analytics**: Engagement metrics and insights dashboard
- **Webhooks & API**: Third-party integrations
- **Marketplace**: Share content and coaching programs

---

## Recently Completed

### Backend Infrastructure ✅

- SQLite database with comprehensive schema
- Repository pattern for clean data access
- JWT authentication with bcrypt password hashing
- Protected API endpoints
- Multi-chat CRUD operations
- Personality/meta-prompt system

### Database Enhancements (Nov 2025) ✅

- Added OWNER role to Role enum
- Created admin_action_logs table
- Created white_label_settings table
- Enhanced library_resources with video metadata:
  - status, duration_seconds, transcript_json
  - speaker_meta_json, thumbnail_url

### Frontend Features ✅

- Login and signup pages
- AuthContext and ProtectedRoute
- Chat list in sidebar
- Personality selector dropdown
- Settings page
- Admin console framework

### API Routes ✅

- `POST /auth/signup`, `/auth/login`, `/auth/logout`
- `GET /auth/me`
- `GET /chats`, `GET /chats/:id/messages`, `DELETE /chats/:id`
- `POST /api/chat` (persistence)
- `GET /meta-prompts`
- `GET /me/settings`, `PUT /me/settings`
- Admin routes for users, programs, analytics

---

## Current Sprint Focus (Nov-Dec 2025)

### Priority 1: Phase 1 Completion

1. **Video/Audio Transcription Pipeline**
   - Integrate Azure AI Speech
   - Implement speaker diarization
   - Store transcript with timestamps in library_resources
   - Status: Not started

2. **Citation-Linked Video Player (Early)**
   - Build video player component
   - Extract timestamps from citations
   - Enable click-to-play from chat
   - Status: Not started

3. **Program-Based RBAC Enforcement**
   - Filter RAG retrieval by user's assigned programs
   - Prevent cross-program data leakage
   - Status: Database ready, implementation needed

### Priority 2: Foundation for Phase 2

4. **Admin Action Logging Hooks**
   - Implement logging for all critical actions
   - Role changes, program deletions, content uploads
   - Status: Database ready, hooks not implemented

5. **Onboarding Flow**
   - Welcome screen for first-time users
   - Guided tour of features
   - Status: Not started

---

## Technical Debt & Improvements

### High Priority

- [ ] **Migrate to Prisma Client**: Currently using raw SQL with better-sqlite3, Prisma schema exists but unused
- [ ] **Add E2E Tests**: Playwright tests for critical user flows
- [ ] **Error Handling**: Consistent error responses across all API routes
- [ ] **Input Validation**: Zod schemas for all API inputs

### Medium Priority

- [ ] **Pagination**: Add pagination to chat list, message history, admin tables
- [ ] **Search**: Search functionality for finding old chats
- [ ] **Performance**: Optimize RAG retrieval for large content libraries
- [ ] **Monitoring**: Application Insights integration for production

### Lower Priority

- [ ] **Chat Rename**: Allow users to rename chat threads
- [ ] **Message Editing**: Edit or delete sent messages
- [ ] **Real-time Sync**: WebSocket support for multi-device chat sync
- [ ] **Rate Limiting**: Protect APIs from abuse

---

## Success Metrics

### Phase 1 (Current)

- All core features working (auth, chat, persistence, RBAC)
- Video transcription pipeline operational
- Program-based access control enforced
- 95% test coverage on critical paths

### Phase 2

- Users can create and manage tiered programs
- Invitation system enables easy client onboarding
- Cross-program isolation verified

### Phase 3

- Citation-linked video player fully functional
- White-label branding deployable for enterprise clients
- Admin audit logs capturing all critical actions
- Onboarding reduces support tickets by 50%

---

## Dependencies & Blockers

### Azure Services Required

- ✅ Azure OpenAI (GPT-4o, text-embedding-3-large)
- ✅ Azure AI Search (vector + semantic search)
- ✅ Azure Blob Storage
- ❌ Azure AI Speech (transcription, diarization) - **Blocker for V-2**
- ✅ Azure Container Apps (deployment)
- ✅ Azure Static Web Apps (frontend hosting)

### External Dependencies

- ✅ React 18 ecosystem
- ✅ Fastify + plugins
- ✅ better-sqlite3 (local dev)
- ⚠️ Prisma (schema exists, not actively used)

---

## Release Strategy

1. **Local Development**: SQLite + all features working
2. **Staging**: Deploy to Azure with PostgreSQL/Cosmos DB
3. **Production**: Gradual rollout with feature flags
4. **Monitoring**: Azure Monitor + Application Insights

---

## Contact & Questions

For questions about this roadmap or implementation priorities, reach out to the development team or review the [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) document for detailed feature tracking.
