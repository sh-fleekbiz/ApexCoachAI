import { database } from './database.js';

export interface AdminActionLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string | null;
  entity_id: number | null;
  description: string | null;
  meta_json: string | null;
  created_at: string;
}

export interface CreateAdminActionLogParameters {
  user_id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  description?: string;
  meta_json?: Record<string, any>;
}

export const adminActionLogRepository = {
  createLog(parameters: CreateAdminActionLogParameters): AdminActionLog {
    const { user_id, action, entity_type, entity_id, description, meta_json } = parameters;
    const result = database
      .prepare(
        `INSERT INTO admin_action_logs (user_id, action, entity_type, entity_id, description, meta_json)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user_id,
        action,
        entity_type ?? null,
        entity_id ?? null,
        description ?? null,
        meta_json ? JSON.stringify(meta_json) : null,
      );

    return this.getLogById(result.lastInsertRowid as number)!;
  },

  getLogById(id: number): AdminActionLog | undefined {
    return database.prepare('SELECT * FROM admin_action_logs WHERE id = ?').get(id) as AdminActionLog | undefined;
  },

  getLogsByUserId(userId: number, limit = 100): AdminActionLog[] {
    return database
      .prepare('SELECT * FROM admin_action_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
      .all(userId, limit) as AdminActionLog[];
  },

  getLogsByAction(action: string, limit = 100): AdminActionLog[] {
    return database
      .prepare('SELECT * FROM admin_action_logs WHERE action = ? ORDER BY created_at DESC LIMIT ?')
      .all(action, limit) as AdminActionLog[];
  },

  getAllLogs(limit = 100, offset = 0): AdminActionLog[] {
    return database
      .prepare('SELECT * FROM admin_action_logs ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(limit, offset) as AdminActionLog[];
  },

  getLogsCount(): number {
    const result = database.prepare('SELECT COUNT(*) as count FROM admin_action_logs').get() as { count: number };
    return result.count;
  },
};
