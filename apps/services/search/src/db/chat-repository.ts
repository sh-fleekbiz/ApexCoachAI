import { withClient } from '../lib/db.js';

export interface Chat {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CreateChatParameters {
  user_id: number;
  title: string;
}

export const chatRepository = {
  async getChatsByUserId(userId: number): Promise<Chat[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM chats WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
      );
      return result.rows as Chat[];
    });
  },

  async getChatById(chatId: number): Promise<Chat | undefined> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM chats WHERE id = $1', [
        chatId,
      ]);
      return result.rows.length > 0 ? (result.rows[0] as Chat) : undefined;
    });
  },

  async createChat(parameters: CreateChatParameters): Promise<Chat> {
    const { user_id, title } = parameters;
    return withClient(async (client) => {
      const result = await client.query(
        'INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING *',
        [user_id, title]
      );
      return result.rows[0] as Chat;
    });
  },

  async updateChatTimestamp(chatId: number): Promise<void> {
    return withClient(async (client) => {
      await client.query(
        'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [chatId]
      );
    });
  },

  async updateChatTitle(chatId: number, title: string): Promise<void> {
    return withClient(async (client) => {
      await client.query(
        'UPDATE chats SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [title, chatId]
      );
    });
  },

  async deleteChat(chatId: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM chats WHERE id = $1', [chatId]);
    });
  },

  async deleteAllChatsForUser(userId: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM chats WHERE user_id = $1', [userId]);
    });
  },

  async getChatsForUser(userId: number): Promise<Chat[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM chats WHERE user_id = $1',
        [userId]
      );
      return result.rows as Chat[];
    });
  },
};
