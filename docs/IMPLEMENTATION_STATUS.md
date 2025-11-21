# Apex Coach AI Implementation Status

**Last Updated**: November 21, 2025  
**Based On**: Product Requirements Document (PRD)

## Overview

This document tracks the implementation status of Apex Coach AI features as defined in the Product Requirements Document. The system is designed as a "Content-as-a-Service" platform for SMB coaches and course creators.

---

## 1. Authentication & Onboarding

| Requirement | Feature            | Status      | Notes                                 |
| ----------- | ------------------ | ----------- | ------------------------------------- |
| A-1         | SSO & Email Auth   | ✅ Complete | JWT-based auth with email/password    |
| A-2         | Onboarding Flow    | 🚧 Partial  | Welcome screen and tour missing       |
| A-3         | Profile Management | ✅ Complete | Nickname, occupation in user settings |

---

## 2. Multimedia Knowledge Base ("The Vault")

| Requirement | Feature                          | Status     | Notes                                          |
| ----------- | -------------------------------- | ---------- | ---------------------------------------------- |
| V-1         | Ingestion Pipeline               | 🚧 Partial | Document upload exists, video/audio pending    |
| V-2         | Auto-Transcription & Diarization | ❌ Missing | Azure AI Speech integration needed             |
| V-3         | Intelligent Indexing             | 🚧 Partial | Basic indexing exists, speaker tagging missing |
| V-4         | Content Rights Compliance        | ❌ Missing | Terms checkbox before upload needed            |
| V-5         | Library UI                       | 🚧 Partial | Basic UI exists, status indicators incomplete  |

**Database Schema Status:**

- ✅ LibraryResource table enhanced with video metadata
- ✅ Fields for transcript_json, speaker_meta_json, duration_seconds
- ✅ Status tracking (pending, processing, indexed, failed)
- ❌ Frontend integration pending

---

## 3. The Coaching Chat Experience

| Requirement | Feature                | Status      | Notes                                        |
| ----------- | ---------------------- | ----------- | -------------------------------------------- |
| C-1         | Multi-Persona System   | ✅ Complete | Personality dropdown with meta-prompts       |
| C-2         | RAG Response Guardrail | ✅ Complete | Citations required, hallucination prevention |
| C-3         | Click-to-Play          | ❌ Missing  | Video player overlay with timestamps needed  |
| C-4         | Persistence            | ✅ Complete | Chat history saved per user                  |
| C-5         | Voice Input            | ❌ Missing  | Azure AI Speech integration needed           |

**Database Schema Status:**

- ✅ Chats and ChatMessages tables
- ✅ MetaPrompt (personalities) table
- ✅ UserSettings table with default personality

---

## 4. Program & User Management

| Requirement | Feature                        | Status            | Notes                                      |
| ----------- | ------------------------------ | ----------------- | ------------------------------------------ |
| P-1         | Program Creation               | 🚧 Partial        | Backend exists, UI incomplete              |
| P-2         | Assignments & RBAC             | 🚧 Partial        | Database schema ready, enforcement partial |
| P-3         | Enrollment                     | ❌ Missing        | Invitation links not implemented           |
| P-4         | Roles (Owner/Admin/Coach/User) | ✅ Complete       | All 4 roles in database                    |
| P-5         | Admin Action Logging           | ✅ Database Ready | Logging hooks need implementation          |

**Database Schema Status:**

- ✅ Program table
- ✅ ProgramAssignment table
- ✅ Invitation table
- ✅ AdminActionLog table (newly added)
- ✅ OWNER role added to Role enum
- 🚧 Frontend admin interfaces incomplete

---

## 5. Admin Console

| Requirement | Feature                | Status            | Notes                                       |
| ----------- | ---------------------- | ----------------- | ------------------------------------------- |
| AD-1        | Dashboard              | 🚧 Partial        | Basic analytics UI exists                   |
| AD-2        | Knowledge Base Manager | 🚧 Partial        | Exists but needs status indicators          |
| AD-3        | White-Label Settings   | ✅ Database Ready | WhiteLabelSettings table created, UI needed |
| AD-4        | Data Export            | ❌ Missing        | Export functionality not implemented        |

**Database Schema Status:**

- ✅ WhiteLabelSettings table (newly added)
- ❌ Export API routes not created

---

## Technical Stack Alignment

### Core Stack (as per PRD)

| Component     | PRD Requirement                   | Current Implementation    | Status      |
| ------------- | --------------------------------- | ------------------------- | ----------- |
| Frontend      | React 18 (Vite) + Tailwind CSS v4 | React 18 + Vite ✅        | ✅ Aligned  |
| Backend       | Node.js (Fastify)                 | Fastify ✅                | ✅ Aligned  |
| Database      | Azure Cosmos DB / PostgreSQL      | SQLite (local dev)        | ⚠️ Mismatch |
| Storage       | Azure Blob Storage                | Azure Blob Storage ✅     | ✅ Aligned  |
| LLM           | Azure OpenAI (GPT-4o)             | Azure OpenAI ✅           | ✅ Aligned  |
| Vector Store  | Azure AI Search                   | Azure AI Search ✅        | ✅ Aligned  |
| Embedding     | text-embedding-3-large            | text-embedding-3-large ✅ | ✅ Aligned  |
| Transcription | Azure AI Speech / Whisper         | Not implemented ❌        | ❌ Missing  |

**Note**: Database uses SQLite for local development. Prisma schema configured for PostgreSQL for production deployment.

---

## Priority Implementation Tasks

### High Priority (Phase 1: Core Features)

1. **Citation-Linked Video Player**
   - Frontend: Video player overlay component
   - Backend: Timestamp extraction in RAG responses
   - Status: ❌ Not started

2. **Video/Audio Transcription Pipeline**
   - Azure AI Speech integration
   - Speaker diarization
   - Status: ❌ Not started

3. **Program-Based Content Filtering**
   - Enforce RBAC in RAG retrieval
   - Filter by user's assigned programs
   - Status: 🚧 Database ready, logic needed

### Medium Priority (Phase 2: Enhancement)

4. **Onboarding Flow**
   - Welcome screen
   - Feature tour overlay
   - Status: ❌ Not started

5. **Admin Action Logging Hooks**
   - Log all critical actions (role changes, deletions, uploads)
   - Admin console viewer
   - Status: ✅ Database ready, ❌ hooks not implemented

6. **White-Label Branding**
   - Settings UI for logo, colors, app name
   - CSS injection system
   - Status: ✅ Database ready, ❌ UI not implemented

### Lower Priority (Phase 3: Polish)

7. **Voice Input**
   - Microphone button
   - Azure AI Speech-to-text
   - Status: ❌ Not started

8. **Data Export**
   - User data export per program
   - Chat history export
   - Status: ❌ Not started

9. **Content Rights Compliance**
   - Terms of service checkbox on upload
   - Status: ❌ Not started

---

## Database Migration Notes

The current implementation uses **SQLite** for local development with a direct database access pattern. The Prisma schema is configured for **PostgreSQL** for Azure deployment but is not currently being used in the application code.

**Migration Path**:

- SQLite schema has been updated to match PRD requirements
- Prisma schema updated but not actively used
- For production: Either migrate to Prisma + PostgreSQL or continue with SQLite + better-sqlite3

---

## Key Files & Locations

### Frontend

- Main App: `packages/webapp/src/index.tsx`
- Chat UI: `packages/webapp/src/pages/chat/Chat.tsx`
- Admin Pages: `packages/webapp/src/pages/admin/*`

### Backend

- API Routes: `packages/search/src/routes/*`
- Repositories: `packages/search/src/db/*-repository.ts`
- Database Schema: `packages/search/src/db/database.ts`

### Shared Types

- Chat Types: `packages/shared/chat-types.ts`

---

## Next Actions

1. **Immediate**: Implement citation-linked video player (C-3)
2. **Week 1**: Video/audio transcription with diarization (V-2)
3. **Week 2**: Program-based RBAC enforcement (P-2)
4. **Week 3**: Onboarding flow (A-2)
5. **Week 4**: Admin action logging hooks (P-5)

---

## Notes on PRD Compliance

- **Strengths**: Core chat, auth, and multi-tenancy infrastructure is solid
- **Gaps**: Multimedia features (video transcription, click-to-play) are the biggest missing pieces
- **Database**: Schema is enterprise-ready with proper RBAC tables
- **Frontend**: Needs UX polish for onboarding and video player integration
