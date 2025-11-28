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

// Admin API functions for meta prompts management
export async function createMetaPrompt(data: {
  name: string;
  promptText: string;
  isDefault?: boolean;
}) {
  const response = await fetch(`${apiBaseUrl}/admin/meta-prompts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create personality');
  }

  return response.json();
}

export async function updateMetaPrompt(
  id: number,
  data: {
    name?: string;
    promptText?: string;
    isDefault?: boolean;
  }
) {
  const response = await fetch(`${apiBaseUrl}/admin/meta-prompts/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update personality');
  }

  return response.json();
}

export async function deleteMetaPrompt(id: number) {
  const response = await fetch(`${apiBaseUrl}/admin/meta-prompts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete personality');
  }

  return response.json();
}

// Library API functions
export async function getLibraryResources(filters?: {
  status?: string;
  search?: string;
  programId?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.programId)
    params.append('programId', filters.programId.toString());

  const queryString = params.toString();
  const url = `${apiBaseUrl}/library${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load library resources');
  }

  return response.json();
}

export async function getResourceById(id: number) {
  const response = await fetch(`${apiBaseUrl}/library/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load resource');
  }

  return response.json();
}

export async function createLibraryResource(data: {
  title: string;
  type: string;
  source: string;
  thumbnailUrl?: string | null;
  programId?: number | null;
}) {
  const response = await fetch(`${apiBaseUrl}/admin/library`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create library resource');
  }

  return response.json();
}

// Knowledge Base API functions
export async function getKnowledgeBaseDocuments(filters?: {
  status?: string;
  search?: string;
  programId?: number;
  trainingStatus?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.programId)
    params.append('programId', filters.programId.toString());
  if (filters?.trainingStatus)
    params.append('trainingStatus', filters.trainingStatus);

  const queryString = params.toString();
  const url = `${apiBaseUrl}/admin/knowledge-base${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load knowledge base documents');
  }

  return response.json();
}

export async function getKnowledgeBaseDocumentById(id: number) {
  const response = await fetch(`${apiBaseUrl}/admin/knowledge-base/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to load document');
  }

  return response.json();
}

export async function uploadKnowledgeBaseDocument(data: FormData) {
  const response = await fetch(`${apiBaseUrl}/admin/knowledge-base`, {
    method: 'POST',
    credentials: 'include',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to upload document');
  }

  return response.json();
}

export async function createKnowledgeBaseDocument(data: {
  title: string;
  type: string;
  source: string;
  programId?: number | null;
  metadata?: any;
}) {
  const response = await fetch(`${apiBaseUrl}/admin/knowledge-base`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create document');
  }

  return response.json();
}

export async function updateKnowledgeBaseDocument(
  id: number,
  data: {
    title?: string;
    status?: string;
    trainingStatus?: string;
    metadata?: any;
    programId?: number | null;
  }
) {
  const response = await fetch(`${apiBaseUrl}/admin/knowledge-base/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update document');
  }

  return response.json();
}

export async function deleteKnowledgeBaseDocument(id: number) {
  const response = await fetch(`${apiBaseUrl}/admin/knowledge-base/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete document');
  }

  return response.json();
}

export async function retrainKnowledgeBaseDocument(id: number) {
  const response = await fetch(
    `${apiBaseUrl}/admin/knowledge-base/${id}/retrain`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to retrain document');
  }

  return response.json();
}

export async function bulkDeleteKnowledgeBaseDocuments(ids: number[]) {
  const response = await fetch(
    `${apiBaseUrl}/admin/knowledge-base/bulk-delete`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk delete documents');
  }

  return response.json();
}

export async function bulkRetrainKnowledgeBaseDocuments(ids: number[]) {
  const response = await fetch(
    `${apiBaseUrl}/admin/knowledge-base/bulk-retrain`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to bulk retrain documents');
  }

  return response.json();
}
