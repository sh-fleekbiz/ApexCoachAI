# Remaining Implementation Tasks

This document outlines the remaining tasks to complete the full multi-chat and personality system implementation.

## Overview

✅ **Completed**: Backend infrastructure, authentication, database schema, API endpoints, frontend auth UI, chat list sidebar

🚧 **Remaining**: Connect chat UI to persistence API, implement personality selector, create settings page

---

## Task 1: Connect Chat Component to Persistence API

### Current State

- Chat component uses the existing `/chat` endpoint (non-persistent)
- Messages are not saved to database
- Cannot load previous chat history
- No chatId state management

### What Needs to Be Done

1. **Update API Client** (`packages/webapp/src/api/index.ts`):

   ```typescript
   // Add new function to send messages with persistence
   export async function sendChatMessage(params: {
     chatId?: number;
     input: string;
     personalityId?: number;
     context?: any;
     stream?: boolean;
   }) {
     const response = await fetch('/api/chat', {
       method: 'POST',
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(params),
     });

     if (!response.ok) {
       throw new Error('Chat request failed');
     }

     return response;
   }

   // Add function to load chat history
   export async function getChatMessages(chatId: number) {
     const response = await fetch(`/chats/${chatId}/messages`, {
       credentials: 'include',
     });

     if (!response.ok) {
       throw new Error('Failed to load chat history');
     }

     return response.json();
   }
   ```

2. **Update Chat Component** (`packages/webapp/src/pages/chat/Chat.tsx`):
   - Add state for `currentChatId`
   - Check URL params for `chatId` on mount
   - If `chatId` exists, load messages from `/chats/:id/messages`
   - Update message sending to use `/api/chat` with `chatId`
   - Handle the returned `chatId` from backend to update state
   - Clear chat when "New Chat" is clicked

3. **Update chat-component**:
   - The chat-component web component may need updates to support:
     - Loading existing messages into the UI
     - Passing chatId to the API
     - Clearing messages when starting new chat

### Acceptance Criteria

- ✅ User can send a message and it persists to database
- ✅ User can click a chat in sidebar and see full history
- ✅ User can start a new chat and see empty state
- ✅ ChatId is maintained in URL for direct linking
- ✅ Messages include proper citations from backend

---

## Task 2: Implement Personality Selector UI

### What Needs to Be Done

1. **Create Personality Context** (`packages/webapp/src/contexts/PersonalityContext.tsx`):

   ```typescript
   interface Personality {
     id: number;
     name: string;
     promptText: string;
     isDefault: boolean;
   }

   interface PersonalityContextType {
     personalities: Personality[];
     selectedPersonalityId: number | undefined;
     setSelectedPersonalityId: (id: number) => void;
     isLoading: boolean;
   }

   // Fetch personalities from /meta-prompts on mount
   // Provide context to app for personality selection
   ```

2. **Add Personality Dropdown to Chat Header**:
   - Update `Chat.tsx` to include personality selector
   - Use Fluent UI `Dropdown` component
   - Display current personality name
   - Send `personalityId` with chat requests

3. **Update Chat API Calls**:
   - Include `personalityId` in `/api/chat` request body
   - Backend will use this to set the system prompt

### Example UI Code

```typescript
// In Chat.tsx
const { personalities, selectedPersonalityId, setSelectedPersonalityId } = usePersonality();

<div className={styles.personalityDropdown}>
  <Dropdown
    label="Coaching Personality"
    options={personalities.map(p => ({ key: p.id, text: p.name }))}
    selectedKey={selectedPersonalityId}
    onChange={(_, option) => setSelectedPersonalityId(option?.key as number)}
  />
</div>
```

### Acceptance Criteria

- ✅ Personality dropdown appears in chat header
- ✅ Dropdown is populated from `/meta-prompts` API
- ✅ Selecting personality changes AI's tone/voice
- ✅ Current personality persists during session
- ✅ Default personality loads if none selected

---

## Task 3: Create Settings Page

### What Needs to Be Done

1. **Create Settings Page** (`packages/webapp/src/pages/settings/Settings.tsx`):

   ```typescript
   export function Settings() {
     const [settings, setSettings] = useState<UserSettings | null>(null);
     const [personalities, setPersonalities] = useState<Personality[]>([]);

     // Fetch from /me/settings and /meta-prompts

     const handleSaveSettings = async () => {
       await fetch('/me/settings', {
         method: 'PUT',
         credentials: 'include',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           defaultPersonalityId: settings.defaultPersonalityId,
           nickname: settings.nickname,
           occupation: settings.occupation,
         }),
       });
     };

     return (
       <div className={styles.settingsContainer}>
         <h1>Settings</h1>

         <section>
           <h2>Default Personality</h2>
           <Dropdown
             options={personalities.map(p => ({ key: p.id, text: p.name }))}
             selectedKey={settings?.defaultPersonalityId}
             onChange={handlePersonalityChange}
           />
         </section>

         <section>
           <h2>Profile</h2>
           <TextField label="Nickname" value={settings?.nickname} onChange={...} />
           <TextField label="Occupation" value={settings?.occupation} onChange={...} />
         </section>

         <PrimaryButton text="Save Settings" onClick={handleSaveSettings} />
       </div>
     );
   }
   ```

2. **Add Settings Route**:
   - Update router in `index.tsx`
   - Add `/settings` route
   - Add link in Layout sidebar

3. **Enable Settings Button in Sidebar**:
   - Remove `disabled` attribute
   - Add `onClick` to navigate to `/settings`

### Acceptance Criteria

- ✅ Settings page is accessible from sidebar
- ✅ Can view and update default personality
- ✅ Can update nickname and occupation
- ✅ Settings persist after save
- ✅ Settings load correctly on page mount

---

## Task 4: Final Integration & Testing

### Testing Checklist

1. **Authentication Flow**:
   - [ ] User can sign up with email/password
   - [ ] User can log in
   - [ ] Unauthenticated users redirected to login
   - [ ] Logout clears session
   - [ ] Protected routes work correctly

2. **Multi-Chat Flow**:
   - [ ] User can start a new chat
   - [ ] Messages persist to database
   - [ ] Chat appears in sidebar list
   - [ ] Clicking chat loads full history
   - [ ] Can have multiple separate chats
   - [ ] Can delete a chat

3. **Personality System**:
   - [ ] Default personality loads correctly
   - [ ] Can select different personality in chat
   - [ ] AI response reflects selected personality
   - [ ] Can set default personality in settings
   - [ ] Default applies to new chats

4. **RAG Functionality**:
   - [ ] Citations still work correctly
   - [ ] Search retrieval works
   - [ ] Streaming responses work
   - [ ] System prompt includes personality

### Bug Fixes & Polish

- Fix any TypeScript errors
- Ensure all endpoints handle errors gracefully
- Add loading states to all async operations
- Add error messages to UI
- Improve mobile responsiveness
- Add confirmation dialogs for destructive actions (delete chat)

---

## Database Migration & Deployment Notes

### Running Locally

1. **Set environment variables**:

   ```bash
   # In .env file or shell
   export DATABASE_PATH="./data/app.db"
   export JWT_SECRET="your-secret-key-here"
   ```

2. **Database will auto-initialize** on first run:
   - Tables created automatically
   - Default personality seeded
   - No manual migration needed

3. **Start the backend**:

   ```bash
   npm run start:search
   ```

   The database plugin will run and initialize the schema.

4. **Test authentication**:
   - Visit `http://localhost:5173`
   - You should be redirected to login
   - Sign up a new account
   - Verify JWT cookie is set

### Deployment Considerations

- **Database Location**: Ensure `DATABASE_PATH` points to persistent storage
- **JWT Secret**: Set `JWT_SECRET` to a strong random value in production
- **HTTPS**: Enable HTTPS for cookie security (set `secure: true` in cookie options)
- **CORS**: Configure CORS settings for frontend origin
- **Database Backups**: Implement regular SQLite backups

---

## API Endpoint Reference

### Authentication

- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Chats

- `GET /chats` - List all chats for current user
- `GET /chats/:id/messages` - Get messages for a chat
- `DELETE /chats/:id` - Delete a chat
- `POST /api/chat` - Send message with persistence

### Personalities & Settings

- `GET /meta-prompts` - List all personalities
- `GET /me/settings` - Get user settings
- `PUT /me/settings` - Update user settings

All endpoints (except auth endpoints) require authentication via JWT cookie.

---

## Known Limitations & Future Improvements

1. **Chat Rename**: Currently chats get title from first message, no rename feature
2. **Chat Search**: No search functionality for finding old chats
3. **Message Editing**: Cannot edit sent messages
4. **Chat Export**: No way to export chat history
5. **Personality CRUD**: No UI for creating/editing personalities (admin only in future)
6. **Pagination**: Chat list and message history not paginated
7. **Real-time Updates**: No WebSocket support for multi-device sync

These can be added in future iterations as Phase 4+ features.

---

## Summary

This implementation has established a solid foundation:

- ✅ Complete backend with database, auth, and APIs
- ✅ Frontend authentication and protected routes
- ✅ Chat list sidebar and navigation
- 🚧 Remaining: Connect chat persistence, add personality UI, create settings page

The remaining tasks are straightforward UI integrations of the already-working backend APIs. Estimated time: 4-8 hours of focused development.
