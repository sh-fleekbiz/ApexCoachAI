import { withClient } from '@shared/data';

export interface WhiteLabelSettings {
  id: number;
  logo_url: string | null;
  brand_color: string | null;
  app_name: string | null;
  custom_css: string | null;
  updated_at: string;
}

export interface UpdateWhiteLabelSettingsParameters {
  logo_url?: string | null;
  brand_color?: string | null;
  app_name?: string | null;
  custom_css?: string | null;
}

export const whiteLabelSettingsRepository = {
  async getSettings(): Promise<WhiteLabelSettings | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM white_label_settings ORDER BY id LIMIT 1'
      );
      return result.rows.length > 0
        ? (result.rows[0] as WhiteLabelSettings)
        : undefined;
    });
  },

  async updateSettings(
    parameters: UpdateWhiteLabelSettingsParameters
  ): Promise<WhiteLabelSettings> {
    return withClient(async (client) => {
      const existingResult = await client.query(
        'SELECT * FROM white_label_settings ORDER BY id LIMIT 1'
      );
      const existing =
        existingResult.rows.length > 0 ? existingResult.rows[0] : null;

      if (existing) {
        // Update existing
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (parameters.logo_url !== undefined) {
          fields.push(`logo_url = $${paramIndex++}`);
          values.push(parameters.logo_url);
        }
        if (parameters.brand_color !== undefined) {
          fields.push(`brand_color = $${paramIndex++}`);
          values.push(parameters.brand_color);
        }
        if (parameters.app_name !== undefined) {
          fields.push(`app_name = $${paramIndex++}`);
          values.push(parameters.app_name);
        }
        if (parameters.custom_css !== undefined) {
          fields.push(`custom_css = $${paramIndex++}`);
          values.push(parameters.custom_css);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(existing.id);

        await client.query(
          `UPDATE white_label_settings SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      } else {
        // Create new
        await client.query(
          `INSERT INTO white_label_settings (logo_url, brand_color, app_name, custom_css)
           VALUES ($1, $2, $3, $4)`,
          [
            parameters.logo_url ?? null,
            parameters.brand_color ?? null,
            parameters.app_name ?? null,
            parameters.custom_css ?? null,
          ]
        );
      }

      const result = await client.query(
        'SELECT * FROM white_label_settings ORDER BY id LIMIT 1'
      );
      return result.rows[0] as WhiteLabelSettings;
    });
  },

  async resetSettings(): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM white_label_settings');
    });
  },
};
