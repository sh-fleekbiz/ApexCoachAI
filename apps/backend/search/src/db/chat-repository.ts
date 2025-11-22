import { database } from './database.js';

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
  getChatsByUserId(userId: number): Chat[] {
    return database.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY updated_at DESC').all(userId) as Chat[];
  },

  getChatById(chatId: number): Chat | undefined {
    return database.prepare('SELECT * FROM chats WHERE id = ?').get(chatId) as Chat | undefined;
  },

  createChat(parameters: CreateChatParameters): Chat {
    const { user_id, title } = parameters;
    const result = database.prepare('INSERT INTO chats (user_id, title) VALUES (?, ?)').run(user_id, title);

    return this.getChatById(result.lastInsertRowid as number)!;
  },

  updateChatTimestamp(chatId: number): void {
    database.prepare('UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(chatId);
  },

  updateChatTitle(chatId: number, title: string): void {
    database.prepare('UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(title, chatId);
  },

  deleteChat(chatId: number): void {
    database.prepare('DELETE FROM chats WHERE id = ?').run(chatId);
  },

  deleteAllChatsForUser(userId: number): void {
    database.prepare('DELETE FROM chats WHERE user_id = ?').run(userId);
  },

  getChatsForUser(userId: number): Chat[] {
    return database.prepare('SELECT * FROM chats WHERE user_id = ?').all(userId) as Chat[];
  },
};
