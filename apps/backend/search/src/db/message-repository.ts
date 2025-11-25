import { withClient } from '@shared/data';
import type { Citation, Role } from 'shared/chat-types.js';

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
  async getMessagesByChatId(
    chatId: number,
    limit?: number
  ): Promise<ChatMessage[]> {
    return withClient(async (client) => {
      if (limit) {
        const result = await client.query(
          'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT $2',
          [chatId, limit]
        );
        return result.rows as ChatMessage[];
      }
      const result = await client.query(
        'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC',
        [chatId]
      );
      return result.rows as ChatMessage[];
    });
  },

  async getRecentMessages(
    chatId: number,
    limit: number
  ): Promise<ChatMessage[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at DESC LIMIT $2',
        [chatId, limit]
      );
      // Return in chronological order (oldest first)
      return (result.rows as ChatMessage[]).reverse();
    });
  },

  async createMessage(
    parameters: CreateMessageParameters
  ): Promise<ChatMessage> {
    const { chat_id, role, content, citations } = parameters;
    const citations_json = citations ? JSON.stringify(citations) : null;

    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO chat_messages (chat_id, role, content, citations_json) VALUES ($1, $2, $3, $4) RETURNING *',
        [chat_id, role, content, citations_json]
      );
      return result.rows[0] as ChatMessage;
    });
  },

  async deleteMessagesByChatId(chatId: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM chat_messages WHERE chat_id = $1', [
        chatId,
      ]);
    });
  },
};
