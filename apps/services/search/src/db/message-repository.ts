import { withClient } from '../lib/db.js';
import type { Citation, Role } from '../types/chat-types.js';

export interface ChatMessage {
  id: number;
  chat_id: number;
  role: Role; // Stored as uppercase in DB, but returned as lowercase for consistency
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
        // Convert role from uppercase (DB) to lowercase (TypeScript)
        return result.rows.map((row) => ({
          ...row,
          role: row.role.toLowerCase() as Role,
        })) as ChatMessage[];
      }
      const result = await client.query(
        'SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC',
        [chatId]
      );
      // Convert role from uppercase (DB) to lowercase (TypeScript)
      return result.rows.map((row) => ({
        ...row,
        role: row.role.toLowerCase() as Role,
      })) as ChatMessage[];
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
      // Convert role from uppercase (DB) to lowercase (TypeScript)
      const messages = result.rows.map((row) => ({
        ...row,
        role: row.role.toLowerCase() as Role,
      })) as ChatMessage[];
      // Return in chronological order (oldest first)
      return messages.reverse();
    });
  },

  async createMessage(
    parameters: CreateMessageParameters
  ): Promise<ChatMessage> {
    const { chat_id, role, content, citations } = parameters;
    const citations_json = citations ? JSON.stringify(citations) : null;
    // Convert role to uppercase to match database constraint
    const roleUpper = role.toUpperCase() as 'USER' | 'ASSISTANT' | 'SYSTEM';

    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO chat_messages (chat_id, role, content, citations_json) VALUES ($1, $2, $3, $4) RETURNING *',
        [chat_id, roleUpper, content, citations_json]
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
