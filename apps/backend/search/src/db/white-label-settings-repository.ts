import { database } from './database.js';

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
  getSettings(): WhiteLabelSettings | undefined {
    // There should only be one row
    return database.prepare('SELECT * FROM white_label_settings ORDER BY id LIMIT 1').get() as
      | WhiteLabelSettings
      | undefined;
  },

  updateSettings(parameters: UpdateWhiteLabelSettingsParameters): WhiteLabelSettings {
    const existing = this.getSettings();

    if (existing) {
      // Update existing
      const fields: string[] = [];
      const values: any[] = [];

      if (parameters.logo_url !== undefined) {
        fields.push('logo_url = ?');
        values.push(parameters.logo_url);
      }
      if (parameters.brand_color !== undefined) {
        fields.push('brand_color = ?');
        values.push(parameters.brand_color);
      }
      if (parameters.app_name !== undefined) {
        fields.push('app_name = ?');
        values.push(parameters.app_name);
      }
      if (parameters.custom_css !== undefined) {
        fields.push('custom_css = ?');
        values.push(parameters.custom_css);
      }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(existing.id);

      database.prepare(`UPDATE white_label_settings SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    } else {
      // Create new
      database
        .prepare(
          `INSERT INTO white_label_settings (logo_url, brand_color, app_name, custom_css)
           VALUES (?, ?, ?, ?)`,
        )
        .run(
          parameters.logo_url ?? null,
          parameters.brand_color ?? null,
          parameters.app_name ?? null,
          parameters.custom_css ?? null,
        );
    }

    return this.getSettings()!;
  },

  resetSettings(): void {
    database.prepare('DELETE FROM white_label_settings').run();
  },
};
