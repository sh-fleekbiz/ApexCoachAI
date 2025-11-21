# Phase 1 Core UX Features - Technical Implementation Plan

## Document Overview

**Status**: Planning Phase  
**Last Updated**: 2025-11-21  
**Target Completion**: TBD  
**Dependencies**: Backend APIs complete, Database schema initialized

---

## 1. Executive Summary

This plan outlines the surgical integration of chat persistence, personality selection, and user settings into the Apex Coach AI frontend. The backend infrastructure is complete—this work focuses exclusively on connecting React components to existing APIs.

### Success Criteria

- ✅ Users can have multiple persistent chat conversations
- ✅ Chat history loads when clicking sidebar items
- ✅ Personality selector populates from API and affects chat behavior
- ✅ Settings page allows profile and preference configuration
- ✅ Zero breaking changes to existing authentication or admin features
- ✅ Mobile-responsive on 375px, 390px, and 1280px viewports

---

## 2. Architecture Overview

### 2.1 Data Flow Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│           Chat.tsx Component                     │
│                                                  │
│  State:                                          │
│  - currentChatId: number | undefined             │
│  - messages: Message[]                           │
│  - selectedPersonalityId: number (from Context)  │
│                                                  │
│  URL: /?chatId=123                              │
└──────┬──────────────────────────────┬───────────┘
       │                              │
       │ sendChatMessage()           │ getChatMessages()
       │                              │
       ▼                              ▼
┌──────────────────────────────────────────────────┐
│          API Client (api/index.ts)               │
└──────┬──────────────────────────────┬───────────┘
       │                              │
       │ POST /api/chat               │ GET /chats/:id/messages
       │                              │
       ▼                              ▼
┌──────────────────────────────────────────────────┐
│     Backend (packages/search/src/routes/)        │
│  - chat-api.ts (persistence)                     │
│  - chat-routes.ts (history)                      │
└──────┬──────────────────────────────┬───────────┘
       │                              │
       ▼                              ▼
┌──────────────────────────────────────────────────┐
│          SQLite Database                         │
│  - chats table                                   │
│  - messages table                                │
│  - meta_prompts table                            │
│  - user_settings table                           │
└──────────────────────────────────────────────────┘
```

### 2.2 Component Interaction

```
Layout.tsx (Sidebar)
    │
    ├─ Displays chat list from GET /chats
    ├─ "New Chat" button → navigate to / (no chatId)
    └─ Click chat → navigate to /?chatId=123
              │
              ▼
        Chat.tsx (Main Content)
              │
              ├─ useSearchParams() to read chatId
              ├─ usePersonality() for personality state
              ├─ useEffect() to load history on chatId change
              └─ Render <chat-component> with loaded messages
                        │
                        └─ Web component handles UI rendering

SettingsPage.tsx
    │
    ├─ Load settings from GET /me/settings
    ├─ Load personalities from PersonalityContext
    ├─ Save to PUT /me/settings
    └─ Display success/error feedback
```

---

## 3. Implementation Tasks

### Task 3.1: Chat Persistence Integration

**File**: `packages/webapp/src/pages/chat/Chat.tsx`

#### 3.1.1 Add Required Imports

```typescript
// Add to existing imports
import { useSearchParams } from 'react-router-dom';
import { useEffect, useCallback } from 'react'; // Add useEffect, useCallback
import { sendChatMessage, getChatMessages } from '../../api/index.js';
import { usePersonality } from '../../contexts/PersonalityContext.tsx';
```

#### 3.1.2 Add State Management

Insert after existing `useState` declarations (around line 36):

```typescript
// Chat persistence state
const [searchParams, setSearchParams] = useSearchParams();
const [currentChatId, setCurrentChatId] = useState<number | undefined>();
const [chatMessages, setChatMessages] = useState<any[]>([]);
const [isLoadingHistory, setIsLoadingHistory] = useState(false);
const { selectedPersonalityId } = usePersonality();
```

#### 3.1.3 Load Chat History from URL

Insert after state declarations:

```typescript
// Effect to load chat history when chatId changes
useEffect(() => {
  const chatIdParam = searchParams.get('chatId');
  if (chatIdParam) {
    const chatId = Number.parseInt(chatIdParam, 10);
    if (!Number.isNaN(chatId) && chatId !== currentChatId) {
      setCurrentChatId(chatId);
      loadChatHistory(chatId);
    }
  } else {
    // No chatId = new chat
    setCurrentChatId(undefined);
    setChatMessages([]);
    clearChatComponent();
  }
}, [searchParams]);

const loadChatHistory = async (chatId: number) => {
  setIsLoadingHistory(true);
  try {
    const data = await getChatMessages(chatId);
    setChatMessages(data.messages || []);

    // Load messages into chat-component
    const chatComponent = chatComponentReference.current;
    if (chatComponent && typeof chatComponent.loadMessages === 'function') {
      chatComponent.loadMessages(data.messages);
    }
  } catch (error) {
    console.error('Failed to load chat history:', error);
  } finally {
    setIsLoadingHistory(false);
  }
};

const clearChatComponent = () => {
  const chatComponent = chatComponentReference.current;
  if (chatComponent && typeof chatComponent.clearMessages === 'function') {
    chatComponent.clearMessages();
  }
};
```

#### 3.1.4 Replace Starter Prompt Handler

**Current** (lines 25-31):

```typescript
const handleStarterPromptClick = (prompt: string) => {
  const chatComponent = chatComponentReference.current;
  if (chatComponent && typeof chatComponent.sendMessage === 'function') {
    chatComponent.sendMessage(prompt);
  }
};
```

**Replace with**:

```typescript
const handleStarterPromptClick = async (prompt: string) => {
  await handleSendMessage(prompt);
};
```

#### 3.1.5 Add Message Send Handler

Insert new function:

```typescript
const handleSendMessage = useCallback(
  async (input: string) => {
    try {
      const response = await sendChatMessage({
        chatId: currentChatId || null,
        input,
        personalityId: selectedPersonalityId || null,
        context: overrides,
        stream: useStream,
      });

      if (useStream) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let assistantMessage = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            assistantMessage += chunk;

            // Update chat component with streaming content
            const chatComponent = chatComponentReference.current;
            if (chatComponent && typeof chatComponent.updateStreamingMessage === 'function') {
              chatComponent.updateStreamingMessage(assistantMessage);
            }
          }
        }
      } else {
        // Handle JSON response
        const data = await response.json();

        // If this was a new chat, update the chatId
        if (!currentChatId && data.chatId) {
          setCurrentChatId(data.chatId);
          setSearchParams({ chatId: data.chatId.toString() });

          // Trigger sidebar refresh
          window.dispatchEvent(new CustomEvent('chat-created', { detail: { chatId: data.chatId } }));
        }

        // Add message to chat component
        const chatComponent = chatComponentReference.current;
        if (chatComponent && typeof chatComponent.addMessage === 'function') {
          chatComponent.addMessage(data.message);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user
    }
  },
  [currentChatId, selectedPersonalityId, overrides, useStream, setSearchParams],
);
```

#### 3.1.6 Connect to Chat Component

Modify `<chat-component>` attributes (around line 230):

```typescript
<chat-component
  ref={chatComponentReference}
  title=""
  data-input-position="sticky"
  data-interaction-model="chat"
  data-api-url={apiBaseUrl}
  data-use-stream={useStream}
  data-approach="rrr"
  data-overrides={JSON.stringify(overrides)}
  data-custom-styles={JSON.stringify(customStyles)}
  data-custom-branding={JSON.stringify(isBrandingEnabled)}
  data-theme={isDarkTheme ? 'dark' : ''}
  data-on-send={handleSendMessage}  // NEW: Connect send handler
></chat-component>
```

**Note**: The `<chat-component>` web component may need modifications to support:

- `loadMessages(messages: Message[])` method
- `clearMessages()` method
- `data-on-send` callback property
- `addMessage(message: Message)` method
- `updateStreamingMessage(content: string)` method

**Risk Mitigation**: If chat-component API is incompatible, consider:

1. Fork and modify chat-component package
2. Replace with pure React implementation (higher effort)
3. Use existing API by posting directly to backend and refreshing UI

---

### Task 3.2: Connect Personality Selector

**File**: `packages/webapp/src/pages/chat/Chat.tsx`

#### 3.2.1 Import Hook (already done in 3.1.1)

```typescript
import { usePersonality } from '../../contexts/PersonalityContext.tsx';
```

#### 3.2.2 Use Hook

Already added in Task 3.1.2:

```typescript
const { selectedPersonalityId } = usePersonality();
```

Add additional destructuring for dropdown:

```typescript
const {
  personalities,
  selectedPersonalityId,
  setSelectedPersonalityId,
  isLoading: isLoadingPersonalities,
} = usePersonality();
```

#### 3.2.3 Replace Static Dropdown

**Current** (lines 188-203):

```typescript
<select
  id="personality-select"
  className={styles.personalitySelect}
  aria-label="Select coaching personality"
>
  <option value="" disabled selected>
    Select a personality
  </option>
  <option value="default">Default Coach</option>
  {/* More personalities will be added later */}
</select>
```

**Replace with**:

```typescript
<select
  id="personality-select"
  className={styles.personalitySelect}
  value={selectedPersonalityId || ''}
  onChange={(e) => setSelectedPersonalityId(Number(e.target.value))}
  aria-label="Select coaching personality"
  disabled={isLoadingPersonalities}
>
  {isLoadingPersonalities ? (
    <option value="" disabled>
      Loading personalities...
    </option>
  ) : personalities.length === 0 ? (
    <option value="" disabled>
      No personalities available
    </option>
  ) : (
    personalities.map((personality) => (
      <option key={personality.id} value={personality.id}>
        {personality.name}
      </option>
    ))
  )}
</select>
```

#### 3.2.4 Acceptance Testing

- [ ] Dropdown populates from API on page load
- [ ] Default personality is pre-selected
- [ ] Changing personality updates state
- [ ] selectedPersonalityId is passed to `sendChatMessage()`
- [ ] AI responses reflect selected personality tone

---

### Task 3.3: Update Layout for Chat List Refresh

**File**: `packages/webapp/src/pages/layout/Layout.tsx`

#### 3.3.1 Add Refresh Event Listener

Insert after existing `useEffect` (around line 25):

```typescript
// Refresh chat list when new chat created
useEffect(() => {
  const handleChatCreated = () => {
    fetchChats();
  };

  window.addEventListener('chat-created', handleChatCreated);
  return () => {
    window.removeEventListener('chat-created', handleChatCreated);
  };
}, []);
```

#### 3.3.2 Optimize New Chat Button

**Current** (lines 45-49):

```typescript
const handleNewChat = () => {
  navigate('/');
  window.location.reload(); // Simple approach for now
};
```

**Replace with**:

```typescript
const handleNewChat = () => {
  // Navigate to chat without chatId parameter
  navigate('/');
  // Don't reload page - Chat.tsx will handle state reset
};
```

#### 3.3.3 Acceptance Testing

- [ ] "New Chat" clears URL params
- [ ] "New Chat" doesn't reload entire page
- [ ] New chat appears in sidebar after first message
- [ ] Clicking sidebar chat loads correct history

---

### Task 4.1: Create Settings Page Component

**File**: `packages/webapp/src/pages/settings/SettingsPage.tsx` (NEW)

```typescript
import { useState, useEffect } from 'react';
import { usePersonality } from '../../contexts/PersonalityContext.tsx';
import { getUserSettings, updateUserSettings } from '../../api/index.ts';
import styles from './SettingsPage.module.css';

interface UserSettings {
  defaultPersonalityId: number | undefined;
  nickname: string;
  occupation: string;
}

export default function SettingsPage() {
  const { personalities, isLoading: isLoadingPersonalities } = usePersonality();
  const [settings, setSettings] = useState<UserSettings>({
    defaultPersonalityId: undefined,
    nickname: '',
    occupation: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getUserSettings();
        setSettings({
          defaultPersonalityId: data.settings.default_personality_id,
          nickname: data.settings.nickname || '',
          occupation: data.settings.occupation || '',
        });
      } catch (error) {
        console.error('Failed to load settings:', error);
        setErrorMessage('Failed to load settings. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      await updateUserSettings({
        defaultPersonalityId: settings.defaultPersonalityId,
        nickname: settings.nickname,
        occupation: settings.occupation,
      });
      setSaveStatus('success');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your profile and coaching preferences</p>
      </div>

      <div className={styles.content}>
        {/* Personality Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Default Coaching Personality</h2>
          <p className={styles.sectionDescription}>
            This personality will be used for new chat conversations by default
          </p>
          <select
            className={styles.select}
            value={settings.defaultPersonalityId || ''}
            onChange={(e) =>
              setSettings({ ...settings, defaultPersonalityId: Number(e.target.value) })
            }
            disabled={isLoadingPersonalities || isSaving}
            aria-label="Default coaching personality"
          >
            {isLoadingPersonalities ? (
              <option value="">Loading personalities...</option>
            ) : (
              personalities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
        </section>

        {/* Profile Settings */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <p className={styles.sectionDescription}>
            Help your coach personalize your experience
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="nickname" className={styles.label}>
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              className={styles.input}
              value={settings.nickname}
              onChange={(e) => setSettings({ ...settings, nickname: e.target.value })}
              placeholder="How should your coach address you?"
              disabled={isSaving}
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="occupation" className={styles.label}>
              Occupation
            </label>
            <input
              id="occupation"
              type="text"
              className={styles.input}
              value={settings.occupation}
              onChange={(e) => setSettings({ ...settings, occupation: e.target.value })}
              placeholder="Your profession or role"
              disabled={isSaving}
              maxLength={100}
            />
          </div>
        </section>

        {/* Save Actions */}
        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
            type="button"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>

          {saveStatus === 'success' && (
            <div className={styles.successMessage} role="alert">
              ✓ Settings saved successfully
            </div>
          )}

          {saveStatus === 'error' && (
            <div className={styles.errorMessage} role="alert">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### Task 4.2: Create Settings Page Styles

**File**: `packages/webapp/src/pages/settings/SettingsPage.module.css` (NEW)

```css
/* Mobile-first responsive design */

.container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.loadingState {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1rem;
  color: var(--text-secondary, #666);
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary, #000);
}

.subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 1.5rem;
}

.sectionTitle {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary, #000);
}

.sectionDescription {
  font-size: 0.875rem;
  color: var(--text-secondary, #666);
  margin: 0 0 1rem 0;
}

.select,
.input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 6px;
  background: var(--bg-input, #fff);
  color: var(--text-primary, #000);
  transition: border-color 0.2s;
}

.select:focus,
.input:focus {
  outline: none;
  border-color: var(--accent-primary, #0078d4);
  box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
}

.select:disabled,
.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.formGroup {
  margin-bottom: 1.25rem;
}

.formGroup:last-child {
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #000);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
}

.saveButton {
  min-width: 150px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background: var(--accent-primary, #0078d4);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  /* Minimum touch target size */
  min-height: 44px;
}

.saveButton:hover:not(:disabled) {
  background: var(--accent-primary-hover, #106ebe);
}

.saveButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.successMessage {
  padding: 0.75rem 1rem;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  color: #155724;
  font-size: 0.875rem;
}

.errorMessage {
  padding: 0.75rem 1rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  color: #721c24;
  font-size: 0.875rem;
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }

  .title {
    font-size: 2rem;
  }

  .actions {
    flex-direction: row;
    align-items: center;
  }

  .saveButton {
    align-self: flex-start;
  }
}
```

---

### Task 4.3: Add Settings Route

**File**: `packages/webapp/src/index.tsx`

#### 4.3.1 Import Component

Add to imports section (around line 12):

```typescript
import SettingsPage from './pages/settings/SettingsPage.tsx';
```

#### 4.3.2 Add Route

Insert route in `children` array (around line 44):

```typescript
children: [
  {
    index: true,
    element: <Chat />,
  },
  {
    path: 'settings',  // NEW
    element: <SettingsPage />,
  },
  {
    path: 'qa',
    lazy: () => import('./pages/oneshot/OneShot.jsx'),
  },
  {
    path: '*',
    lazy: () => import('./pages/NoPage.jsx'),
  },
],
```

---

### Task 4.4: Add Settings Navigation in Layout

**File**: `packages/webapp/src/pages/layout/Layout.tsx`

#### 4.4.1 Update Settings Section

**Current** (lines 104-109):

```typescript
<div className={styles.navSection}>
  <h3 className={styles.navSectionTitle}>Settings</h3>
  <button className={styles.navSectionButton} onClick={() => setIsSettingsOpen(true)}>
    Open Settings
  </button>
</div>
```

**Replace with**:

```typescript
<div className={styles.navSection}>
  <h3 className={styles.navSectionTitle}>Account</h3>
  <button
    className={styles.navSectionButton}
    onClick={() => navigate('/settings')}
    type="button"
  >
    Settings
  </button>
  <button
    className={styles.navSectionButton}
    onClick={() => setIsSettingsOpen(true)}
    type="button"
  >
    Data & Privacy
  </button>
</div>
```

This keeps the existing data export/privacy modal and adds navigation to the new settings page.

---

## 4. Risk Assessment & Mitigation

### 4.1 Technical Risks

| Risk                                   | Impact | Probability | Mitigation                                                                                              |
| -------------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------- |
| chat-component API incompatibility     | High   | Medium      | 1. Review chat-component source<br>2. Fork if needed<br>3. Document required methods                    |
| Streaming response handling complexity | Medium | High        | 1. Test with useStream=false first<br>2. Add streaming incrementally<br>3. Fallback to non-streaming    |
| URL state management bugs              | Medium | Medium      | 1. Use React Router's useSearchParams<br>2. Add URL validation<br>3. Handle edge cases (invalid chatId) |
| Sidebar not refreshing after new chat  | Low    | Medium      | 1. Use custom event dispatch<br>2. Consider React Context alternative<br>3. Add manual refresh button   |

### 4.2 Security Considerations

- ✅ All API calls use `credentials: 'include'` for cookie auth
- ✅ No API keys in frontend code
- ✅ Input validation for chatId (parse as number, check NaN)
- ✅ No localStorage of sensitive data
- ✅ Settings update validates user owns the settings

### 4.3 Performance Considerations

- Chat history loading: Acceptable for <100 messages per chat
- Personality list: Cached in Context, fetched once on mount
- Chat list: Fetched on mount and on chat-created event
- Consider pagination for chat list if >50 chats

---

## 5. Testing Strategy

### 5.1 Unit Testing (Out of Scope)

The repository appears to use Playwright for E2E testing. Unit tests are not requested.

### 5.2 Manual Testing Checklist

#### Authentication (Pre-existing)

- [ ] Login works
- [ ] Logout works
- [ ] Protected routes redirect to /login

#### Chat Persistence Flow

- [ ] Send first message → chat created, appears in sidebar
- [ ] Send follow-up → appends to same chat
- [ ] URL contains `?chatId=123`
- [ ] Refresh page → chat history loads
- [ ] Click sidebar chat → loads correct history
- [ ] "New Chat" → clears chatId, starts fresh
- [ ] Invalid chatId in URL → graceful handling

#### Personality Selection

- [ ] Dropdown loads personalities on mount
- [ ] Default personality selected initially
- [ ] Changing personality updates state
- [ ] Personality ID sent with messages
- [ ] Loading state displays while fetching

#### Settings Page

- [ ] Navigate to /settings
- [ ] Settings load from API
- [ ] Change default personality
- [ ] Update nickname and occupation
- [ ] Save → success message
- [ ] Reload page → changes persisted
- [ ] API error → error message displayed

#### Mobile Responsiveness

- [ ] Test on 375px viewport (Pixel 5)
- [ ] Test on 390px viewport (iPhone 12)
- [ ] Test on 1280px viewport (Desktop)
- [ ] Touch targets ≥44x44px
- [ ] No horizontal scroll
- [ ] Text readable without zoom

### 5.3 Edge Cases

- [ ] Empty chat list
- [ ] Empty personality list
- [ ] Very long chat (>50 messages)
- [ ] Network timeout during API call
- [ ] Rapid clicking "New Chat" button
- [ ] Concurrent requests to same API
- [ ] Browser back button navigation
- [ ] Chat deleted while viewing it

---

## 6. Implementation Sequence

### Phase A: Foundation (Day 1)

1. ✅ Task 3.2: Connect personality selector (low risk, high visibility)
2. ✅ Task 3.3: Update Layout for refresh events

### Phase B: Core Persistence (Day 2-3)

3. ✅ Task 3.1.1-3.1.3: Add state and URL handling
4. ✅ Task 3.1.4-3.1.5: Replace handlers with persistence
5. ⚠️ Task 3.1.6: Investigate chat-component API
   - If compatible: integrate
   - If not: document required changes

### Phase C: Settings (Day 4)

6. ✅ Task 4.1-4.2: Create SettingsPage component and styles
7. ✅ Task 4.3: Add route
8. ✅ Task 4.4: Add navigation

### Phase D: Testing & Refinement (Day 5)

9. ✅ Manual testing per checklist
10. ✅ Fix bugs discovered
11. ✅ Mobile responsiveness verification
12. ✅ Update IMPLEMENTATION_STATUS.md

---

## 7. Environment Variables & Secrets

### Required Environment Variables

**Frontend (Build-time)**:

```bash
VITE_SEARCH_API_URI=http://localhost:50505  # Development
VITE_SEARCH_API_URI=https://your-backend.azurecontainerapps.io  # Production
```

**Backend (Runtime)**:

```bash
DATABASE_PATH=/app/data/app.db
JWT_SECRET=<256-bit-random-secret>
NODE_ENV=production
```

### Verification

```bash
# Check frontend config
echo $VITE_SEARCH_API_URI

# Check backend config
docker exec <container> env | grep DATABASE_PATH
```

---

## 8. API Endpoint Reference

### Chat Persistence

**POST /api/chat**

```typescript
// Request
{
  chatId?: number | null;  // Omit for new chat
  input: string;
  personalityId?: number | null;
  context?: RequestOverrides;
  stream?: boolean;
}

// Response (stream=false)
{
  chatId: number;
  message: {
    id: string;
    role: "assistant";
    content: string;
    citations: Citation[];
  }
}

// Response (stream=true)
// Server-Sent Events stream
```

**GET /chats/:id/messages**

```typescript
// Response
{
  messages: Array<{
    id: number;
    chat_id: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}
```

### Personalities

**GET /meta-prompts**

```typescript
// Response
{
  metaPrompts: Array<{
    id: number;
    name: string;
    prompt_text: string;
    is_default: boolean;
  }>;
}
```

### User Settings

**GET /me/settings**

```typescript
// Response
{
  settings: {
    user_id: number;
    default_personality_id: number | null;
    nickname: string | null;
    occupation: string | null;
  }
}
```

**PUT /me/settings**

```typescript
// Request
{
  defaultPersonalityId?: number;
  nickname?: string;
  occupation?: string;
}

// Response
{
  settings: {
    user_id: number;
    default_personality_id: number | null;
    nickname: string | null;
    occupation: string | null;
  }
}
```

---

## 9. Code Style & Patterns

### 9.1 React Hooks Pattern

```typescript
// Consistent hook ordering
const navigate = useNavigate();
const [searchParams, setSearchParams] = useSearchParams();
const { user } = useAuth();
const { personalities, selectedPersonalityId } = usePersonality();
const [localState, setLocalState] = useState();

useEffect(() => {
  // Side effects
}, [dependencies]);
```

### 9.2 Error Handling Pattern

```typescript
try {
  const response = await apiCall();
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('Descriptive error context:', error);
  // Show user-friendly error message
}
```

### 9.3 TypeScript Patterns

```typescript
// Use interfaces for props
interface ComponentProps {
  required: string;
  optional?: number;
}

// Use type narrowing
const chatId = Number.parseInt(param, 10);
if (!Number.isNaN(chatId)) {
  // Safe to use chatId
}

// Avoid `any` types
const [settings, setSettings] = useState<UserSettings>({
  defaultPersonalityId: undefined,
  nickname: '',
  occupation: '',
});
```

### 9.4 Accessibility Patterns

```typescript
// Semantic HTML
<button type="button" aria-label="Descriptive action">
  Icon-only button
</button>

// Form labels
<label htmlFor="input-id">Label text</label>
<input id="input-id" type="text" />

// Loading states
<div role="status" aria-live="polite">
  Loading...
</div>

// Error messages
<div role="alert" className={styles.errorMessage}>
  Error text
</div>
```

---

## 10. Rollback Plan

### If Implementation Blocked

1. **Chat component incompatibility**
   - Rollback: Keep existing inline chat, skip persistence
   - Alternative: Create pure React chat UI

2. **API errors in production**
   - Rollback: Feature flag to disable persistence
   - Alternative: Add error boundaries

3. **Performance issues**
   - Rollback: Add pagination to chat list
   - Alternative: Debounce API calls

### Git Strategy

- Work in feature branch: `feature/phase1-ux-integration`
- Commit after each task completion
- Tag before risky changes: `git tag pre-chat-component-integration`
- Merge to main only after full testing

---

## 11. Success Metrics

### Functional Completeness

- [ ] All tasks in Section 3 completed
- [ ] Zero breaking changes to existing features
- [ ] All manual tests pass
- [ ] Mobile responsive at 3 breakpoints

### Code Quality

- [ ] No TypeScript compilation errors
- [ ] No ESLint errors introduced
- [ ] Consistent with existing code style
- [ ] Proper error handling for all API calls

### User Experience

- [ ] Chat persistence works end-to-end
- [ ] Personality selection is intuitive
- [ ] Settings page is usable and clear
- [ ] Loading states prevent user confusion

---

## 12. Post-Implementation Tasks

1. Update `IMPLEMENTATION_STATUS.md` Phase 3 status to Complete
2. Document chat-component API changes (if any)
3. Create user-facing documentation for settings
4. Add telemetry/analytics for feature usage (future)
5. Consider E2E tests with Playwright (future)

---

## 13. Open Questions

1. **Chat Component API**: Does `<chat-component>` support programmatic message loading?
   - **Action**: Review packages/chat-component/src/components/chat-component.ts
   - **Decision Point**: Fork vs replace vs work-around

2. **Streaming Implementation**: How to handle partial message display?
   - **Action**: Test with useStream=false first
   - **Decision Point**: Defer streaming to Phase 2 if complex

3. **Chat List Pagination**: What's the max expected chat count?
   - **Action**: Start without pagination, add if needed
   - **Decision Point**: Paginate at >50 chats

4. **Settings Validation**: Should nickname/occupation have length limits?
   - **Action**: Set reasonable maxLength attributes (100 chars)
   - **Decision Point**: Backend may already validate

---

## 14. Dependencies & Prerequisites

### Before Starting

- ✅ Backend APIs deployed and accessible
- ✅ Database schema initialized with default personality
- ✅ JWT authentication working
- ✅ PersonalityContext created and wrapped
- ✅ VITE_SEARCH_API_URI configured

### External Dependencies

- React Router v6 (already installed)
- Lit Element (chat-component dependency)
- Fluent UI components (already used in Chat.tsx)

### No New Dependencies Required

All functionality can be implemented with existing packages.

---

## 15. Documentation Updates

### Files to Update After Implementation

1. `IMPLEMENTATION_STATUS.md`
   - Mark Phase 3 as Complete
   - Update test results

2. `docs/roadmap.md`
   - Check off Phase 1 features

3. `README.md`
   - Update feature list to reflect working persistence
   - Add screenshots if UI changed

4. `TESTING.md`
   - Add test cases for chat persistence
   - Add test cases for settings page

---

## Appendix A: Type Definitions

```typescript
// Message type
interface Message {
  id: number;
  chat_id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Personality type (from PersonalityContext)
interface Personality {
  id: number;
  name: string;
  prompt_text: string;
  is_default: boolean;
}

// User Settings type
interface UserSettings {
  user_id: number;
  default_personality_id: number | null;
  nickname: string | null;
  occupation: string | null;
}

// Chat type (from Layout.tsx)
interface Chat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Appendix B: File Structure

```
packages/webapp/src/
├── api/
│   └── index.ts (MODIFY: already complete)
├── contexts/
│   └── PersonalityContext.tsx (EXISTS: already complete)
├── pages/
│   ├── chat/
│   │   ├── Chat.tsx (MODIFY: Tasks 3.1, 3.2)
│   │   └── Chat.module.css (no changes needed)
│   ├── layout/
│   │   ├── Layout.tsx (MODIFY: Task 3.3, 4.4)
│   │   └── Layout.module.css (no changes needed)
│   └── settings/
│       ├── SettingsPage.tsx (CREATE: Task 4.1)
│       └── SettingsPage.module.css (CREATE: Task 4.2)
└── index.tsx (MODIFY: Task 4.3)
```

---

**Plan Status**: ✅ COMPLETE AND READY FOR IMPLEMENTATION

**Estimated Implementation Time**: 3-5 days

**Next Step**: Review chat-component API to confirm compatibility, then begin Phase A implementation.
