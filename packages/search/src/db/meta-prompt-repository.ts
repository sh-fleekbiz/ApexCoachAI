import { database } from './database.js';

export interface MetaPrompt {
  id: number;
  name: string;
  prompt_text: string;
  is_default: number; // SQLite stores booleans as 0/1
  created_at: string;
}

export interface CreateMetaPromptParameters {
  name: string;
  prompt_text: string;
  is_default?: boolean;
}

export const metaPromptRepository = {
  getAllMetaPrompts(): MetaPrompt[] {
    return database.prepare('SELECT * FROM meta_prompts ORDER BY created_at DESC').all() as MetaPrompt[];
  },

  getMetaPromptById(id: number): MetaPrompt | undefined {
    return database.prepare('SELECT * FROM meta_prompts WHERE id = ?').get(id) as MetaPrompt | undefined;
  },

  getDefaultMetaPrompt(): MetaPrompt | undefined {
    return database.prepare('SELECT * FROM meta_prompts WHERE is_default = 1 LIMIT 1').get() as MetaPrompt | undefined;
  },

  createMetaPrompt(parameters: CreateMetaPromptParameters): MetaPrompt {
    const { name, prompt_text, is_default } = parameters;

    // If setting as default, unset other defaults first
    if (is_default) {
      database.prepare('UPDATE meta_prompts SET is_default = 0').run();
    }

    const result = database
      .prepare('INSERT INTO meta_prompts (name, prompt_text, is_default) VALUES (?, ?, ?)')
      .run(name, prompt_text, is_default ? 1 : 0);

    return this.getMetaPromptById(result.lastInsertRowid as number)!;
  },

  updateMetaPrompt(id: number, parameters: Partial<CreateMetaPromptParameters>): void {
    const { name, prompt_text, is_default } = parameters;

    // If setting as default, unset other defaults first
    if (is_default) {
      database.prepare('UPDATE meta_prompts SET is_default = 0').run();
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (prompt_text !== undefined) {
      updates.push('prompt_text = ?');
      values.push(prompt_text);
    }
    if (is_default !== undefined) {
      updates.push('is_default = ?');
      values.push(is_default ? 1 : 0);
    }

    if (updates.length > 0) {
      values.push(id);
      database.prepare(`UPDATE meta_prompts SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }
  },

  deleteMetaPrompt(id: number): void {
    database.prepare('DELETE FROM meta_prompts WHERE id = ?').run(id);
  },
};
