import { database } from './database.js';
import type { Role, Citation } from 'shared/chat-types.js';

export interface ChatMessage {
  id: number;
  chat_id: number;
  role: Role;
  content: string;
  citations_json: string | null;
  created_at: string;
}

export interface CreateMessageParameters {
  chat_id: number;
  role: Role;
  content: string;
  citations?: Citation[];
}

export const messageRepository = {
  getMessagesByChatId(chatId: number, limit?: number): ChatMessage[] {
    if (limit) {
      return database
        .prepare('SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT ?')
        .all(chatId, limit) as ChatMessage[];
    }
    return database
      .prepare('SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC')
      .all(chatId) as ChatMessage[];
  },

  getRecentMessages(chatId: number, limit: number): ChatMessage[] {
    const messages = database
      .prepare('SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at DESC LIMIT ?')
      .all(chatId, limit) as ChatMessage[];

    // Return in chronological order (oldest first)
    return messages.reverse();
  },

  createMessage(parameters: CreateMessageParameters): ChatMessage {
    const { chat_id, role, content, citations } = parameters;
    const citations_json = citations ? JSON.stringify(citations) : undefined;

    const result = database
      .prepare('INSERT INTO chat_messages (chat_id, role, content, citations_json) VALUES (?, ?, ?, ?)')
      .run(chat_id, role, content, citations_json);

    return database.prepare('SELECT * FROM chat_messages WHERE id = ?').get(result.lastInsertRowid) as ChatMessage;
  },

  deleteMessagesByChatId(chatId: number): void {
    database.prepare('DELETE FROM chat_messages WHERE chat_id = ?').run(chatId);
  },
};
