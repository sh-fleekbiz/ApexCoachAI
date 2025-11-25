import { withClient } from '@shared/data';

export interface MetaPrompt {
  id: number;
  name: string;
  prompt_text: string;
  is_default: boolean;
  created_at: string;
}

export interface CreateMetaPromptParameters {
  name: string;
  prompt_text: string;
  is_default?: boolean;
}

export const metaPromptRepository = {
  async getAllMetaPrompts(): Promise<MetaPrompt[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM meta_prompts ORDER BY created_at DESC'
      );
      return result.rows as MetaPrompt[];
    });
  },

  async getMetaPromptById(id: number): Promise<MetaPrompt | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM meta_prompts WHERE id = $1',
        [id]
      );
      return result.rows.length > 0
        ? (result.rows[0] as MetaPrompt)
        : undefined;
    });
  },

  async getDefaultMetaPrompt(): Promise<MetaPrompt | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM meta_prompts WHERE is_default = TRUE LIMIT 1'
      );
      return result.rows.length > 0
        ? (result.rows[0] as MetaPrompt)
        : undefined;
    });
  },

  async createMetaPrompt(
    parameters: CreateMetaPromptParameters
  ): Promise<MetaPrompt> {
    const { name, prompt_text, is_default } = parameters;

    return withClient(async (client) => {
      // If setting as default, unset other defaults first
      if (is_default) {
        await client.query('UPDATE meta_prompts SET is_default = FALSE');
      }

      const result = await client.query(
        'INSERT INTO meta_prompts (name, prompt_text, is_default) VALUES ($1, $2, $3) RETURNING *',
        [name, prompt_text, is_default ?? false]
      );
      return result.rows[0] as MetaPrompt;
    });
  },

  async updateMetaPrompt(
    id: number,
    parameters: Partial<CreateMetaPromptParameters>
  ): Promise<void> {
    const { name, prompt_text, is_default } = parameters;

    return withClient(async (client) => {
      // If setting as default, unset other defaults first
      if (is_default) {
        await client.query('UPDATE meta_prompts SET is_default = FALSE');
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (prompt_text !== undefined) {
        updates.push(`prompt_text = $${paramIndex++}`);
        values.push(prompt_text);
      }
      if (is_default !== undefined) {
        updates.push(`is_default = $${paramIndex++}`);
        values.push(is_default);
      }

      if (updates.length > 0) {
        values.push(id);
        await client.query(
          `UPDATE meta_prompts SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }
    });
  },

  async deleteMetaPrompt(id: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM meta_prompts WHERE id = $1', [id]);
    });
  },
};
