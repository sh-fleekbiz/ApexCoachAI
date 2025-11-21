/**
 * Shared types for chat functionality between frontend and backend
 */

export type Role = 'user' | 'assistant' | 'system';

export type CitationType = 'text' | 'video';

export interface Citation {
  id: string;
  type: CitationType;
  sourceId: string;
  title: string;
  page?: number;
  startSeconds?: number;
  snippet?: string;
}

export interface ChatMessageDTO {
  id: string;
  role: Role;
  content: string;
  citations?: Citation[];
  createdAt?: string;
}

export interface ChatRequestDTO {
  chatId?: string;
  input: string;
  personalityId?: string; // stub for now, not used yet
}

export interface ChatResponseDTO {
  chatId?: string;
  messages: ChatMessageDTO[];
}
