import { database } from './database.js';

export interface UserSettings {
  user_id: number;
  default_personality_id: number | null;
  nickname: string | null;
  occupation: string | null;
}

export interface UpsertUserSettingsParameters {
  user_id: number;
  default_personality_id?: number | null;
  nickname?: string | null;
  occupation?: string | null;
}

export const userSettingsRepository = {
  getUserSettings(userId: number): UserSettings | undefined {
    return database.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId) as UserSettings | undefined;
  },

  upsertUserSettings(parameters: UpsertUserSettingsParameters): UserSettings {
    const { user_id, default_personality_id, nickname, occupation } = parameters;

    const existing = this.getUserSettings(user_id);

    if (existing) {
      // Update existing settings
      const updates: string[] = [];
      const values: any[] = [];

      if (default_personality_id !== undefined) {
        updates.push('default_personality_id = ?');
        values.push(default_personality_id);
      }
      if (nickname !== undefined) {
        updates.push('nickname = ?');
        values.push(nickname);
      }
      if (occupation !== undefined) {
        updates.push('occupation = ?');
        values.push(occupation);
      }

      if (updates.length > 0) {
        values.push(user_id);
        database.prepare(`UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`).run(...values);
      }
    } else {
      // Insert new settings
      database
        .prepare(
          'INSERT INTO user_settings (user_id, default_personality_id, nickname, occupation) VALUES (?, ?, ?, ?)',
        )
        .run(user_id, default_personality_id ?? undefined, nickname ?? undefined, occupation ?? undefined);
    }

    return this.getUserSettings(user_id)!;
  },

  deleteUserSettings(userId: number): void {
    database.prepare('DELETE FROM user_settings WHERE user_id = ?').run(userId);
  },
};
