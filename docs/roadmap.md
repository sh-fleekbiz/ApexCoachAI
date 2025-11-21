# Apex Coach AI Roadmap

This document outlines the planned features and enhancements for Apex Coach AI.

## Phase 1: Foundation (Current)

- [x] Extract RAG logic into RagClient abstraction
- [x] Establish shared type definitions
- [x] Rebrand UI to Apex Coach AI
- [x] Create coaching-oriented UI layout with sidebar and starter prompts

## Phase 2: User Authentication & Chat History

- [x] Implement user authentication system (JWT with HTTP-only cookies)
- [x] Add database for persistent chat history (SQLite with better-sqlite3)
- [x] Store and retrieve conversations per user
- [x] Enable chat session management (create, delete)
- [x] Add user profile management
- [x] Create login and signup pages
- [x] Implement protected routes and auth context
- [ ] Connect chat UI to persistence API (in progress)
- [ ] Enable full multi-chat experience

## Phase 3: Personality/Meta Prompt System

- [x] Design personality model (coaching styles, tones, approaches)
- [x] Implement meta-prompt templates for different coaching personas
- [x] Seed default personality ("Tim – Inside Out Marriage Coach")
- [x] Backend API for personalities and user settings
- [ ] Create personality selector UI in chat header
- [ ] Add personality configuration in settings page
- [ ] Support custom system prompts per personality

## Phase 4: Library & Knowledge Base Ingestion

- [ ] Build library management system for coaching resources
- [ ] Implement content ingestion pipeline (PDF, video, audio transcripts)
- [ ] Add content categorization and tagging
- [ ] Create content preview and search UI
- [ ] Support video timestamp citations
- [ ] Enable users to explore library independently

## Phase 5: Admin Portal

- [x] Create admin dashboard for content management
- [x] Add user management and analytics
- [ ] Implement personality configuration UI
- [ ] Add content approval workflow
- [x] Enable system monitoring and health checks
- [ ] Support bulk content operations
- [x] Data controls (export, delete)

## Phase 6: Voice Support

- [ ] Integrate speech-to-text for voice input
- [ ] Add text-to-speech for voice responses
- [ ] Support real-time voice conversations
- [ ] Optimize for mobile voice UX
- [ ] Add voice command shortcuts

## Phase 7: React Native Mobile App

- [ ] Create React Native app scaffolding
- [ ] Implement authentication flow for mobile
- [ ] Build mobile-optimized chat UI
- [ ] Add push notifications for insights/reminders
- [ ] Support offline mode with sync
- [ ] Release to iOS App Store and Google Play

## Future Considerations

- Multi-language support
- Team/organization features
- Integration with calendar/productivity tools
- Advanced analytics and insights dashboard
- Webhooks and API access for third-party integrations
- White-label options for enterprise customers

## Recently Completed (Phase 2 & 3)

### Backend Infrastructure ✅

- **Database Layer**: SQLite database with 5 core tables (users, chats, chat_messages, meta_prompts, user_settings)
- **Repository Pattern**: Clean data access layer for all entities
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Protected Endpoints**: All chat/settings endpoints require authentication
- **Multi-Chat API**: Full CRUD operations for chats and messages
- **Personalities API**: Backend support for multiple coaching personalities

### Auth Routes ✅

- `POST /auth/signup` - Create user with hashed password
- `POST /auth/login` - Authenticate and return JWT cookie
- `POST /auth/logout` - Clear session
- `GET /auth/me` - Get current user info

### Chat Routes ✅

- `GET /chats` - List user's chats
- `GET /chats/:id/messages` - Get chat history
- `DELETE /chats/:id` - Delete chat
- `POST /api/chat` - Send message with persistence

### Settings Routes ✅

- `GET /meta-prompts` - List all personalities
- `GET /me/settings` - Get user settings
- `PUT /me/settings` - Update default personality

### Frontend Auth ✅

- Login and signup pages with form validation
- AuthContext for managing authentication state
- ProtectedRoute component for route guards
- Sidebar with logout button and user info
- Chat list fetched from backend API
- "New Chat" button functionality

## Next Steps (Immediate)

1. **Connect Chat UI to Backend**:

   - Modify chat component to use `/api/chat` endpoint
   - Add chatId state management
   - Load chat history when selecting from sidebar
   - Persist new messages to database

2. **Personality Selector UI**:

   - Add dropdown in chat header for personality selection
   - Fetch personalities from `/meta-prompts`
   - Send personalityId with chat requests
   - Show current personality in UI

3. **Settings Page**:

   - Create dedicated settings page
   - Allow users to set default personality
   - Display user profile information

4. **Testing & Polish**:
   - End-to-end testing of auth + chat flow
   - Fix any remaining bugs
   - Security audit of authentication
   - Performance optimization
