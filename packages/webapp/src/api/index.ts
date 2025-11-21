export * from './models.js';
export const apiBaseUrl = import.meta.env.VITE_SEARCH_API_URI ?? '';

// Type for chat context object
export interface ChatContext {
  [key: string]: unknown;
}

// API Functions for chat persistence
export async function sendChatMessage(parameters: {
  chatId?: number | null;
  input: string;
  personalityId?: number | null;
  context?: ChatContext;
  stream?: boolean;
}) {
  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parameters),
  });

  if (!response.ok) {
    throw new Error('Chat request failed');
  }

  return response;
}

export async function getChatMessages(chatId: number) {
  const response = await fetch(`${apiBaseUrl}/chats/${chatId}/messages`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load chat messages');
  }

  return response.json();
}

export async function getMetaPrompts() {
  const response = await fetch(`${apiBaseUrl}/meta-prompts`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load personalities');
  }

  return response.json();
}

export async function getUserSettings() {
  const response = await fetch(`${apiBaseUrl}/me/settings`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load settings');
  }

  return response.json();
}

export async function updateUserSettings(settings: {
  defaultPersonalityId?: number;
  nickname?: string;
  occupation?: string;
}) {
  const response = await fetch(`${apiBaseUrl}/me/settings`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }

  return response.json();
}
