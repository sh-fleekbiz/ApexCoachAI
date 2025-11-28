import { withClient } from '../lib/db.js';

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
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [userId]
      );
      return result.rows.length > 0
        ? (result.rows[0] as UserSettings)
        : undefined;
    });
  },

  async upsertUserSettings(
    parameters: UpsertUserSettingsParameters
  ): Promise<UserSettings> {
    const { user_id, default_personality_id, nickname, occupation } =
      parameters;

    return withClient(async (client) => {
      const existingResult = await client.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [user_id]
      );
      const existing =
        existingResult.rows.length > 0 ? existingResult.rows[0] : null;

      if (existing) {
        // Update existing settings
        const updates: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (default_personality_id !== undefined) {
          updates.push(`default_personality_id = $${paramIndex++}`);
          values.push(default_personality_id);
        }
        if (nickname !== undefined) {
          updates.push(`nickname = $${paramIndex++}`);
          values.push(nickname);
        }
        if (occupation !== undefined) {
          updates.push(`occupation = $${paramIndex++}`);
          values.push(occupation);
        }

        if (updates.length > 0) {
          values.push(user_id);
          await client.query(
            `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = $${paramIndex}`,
            values
          );
        }
      } else {
        // Insert new settings
        await client.query(
          'INSERT INTO user_settings (user_id, default_personality_id, nickname, occupation) VALUES ($1, $2, $3, $4)',
          [
            user_id,
            default_personality_id ?? null,
            nickname ?? null,
            occupation ?? null,
          ]
        );
      }

      const result = await client.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [user_id]
      );
      return result.rows[0] as UserSettings;
    });
  },

  async deleteUserSettings(userId: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM user_settings WHERE user_id = $1', [
        userId,
      ]);
    });
  },
};
