import { withClient } from '@shared/data';

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
  async createLog(
    parameters: CreateAdminActionLogParameters
  ): Promise<AdminActionLog> {
    const { user_id, action, entity_type, entity_id, description, meta_json } =
      parameters;
    return withClient(async (client) => {
      const result = await client.query(
        `INSERT INTO admin_action_logs (user_id, action, entity_type, entity_id, description, meta_json)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          user_id,
          action,
          entity_type ?? null,
          entity_id ?? null,
          description ?? null,
          meta_json ? JSON.stringify(meta_json) : null,
        ]
      );
      return result.rows[0] as AdminActionLog;
    });
  },

  async getLogById(id: number): Promise<AdminActionLog | undefined> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM admin_action_logs WHERE id = $1',
        [id]
      );
      return result.rows.length > 0
        ? (result.rows[0] as AdminActionLog)
        : undefined;
    });
  },

  async getLogsByUserId(
    userId: number,
    limit = 100
  ): Promise<AdminActionLog[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM admin_action_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
      return result.rows as AdminActionLog[];
    });
  },

  async getLogsByAction(
    action: string,
    limit = 100
  ): Promise<AdminActionLog[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM admin_action_logs WHERE action = $1 ORDER BY created_at DESC LIMIT $2',
        [action, limit]
      );
      return result.rows as AdminActionLog[];
    });
  },

  async getAllLogs(limit = 100, offset = 0): Promise<AdminActionLog[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM admin_action_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows as AdminActionLog[];
    });
  },

  async getLogsCount(): Promise<number> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT COUNT(*) as count FROM admin_action_logs'
      );
      return parseInt(result.rows[0].count, 10);
    });
  },
};
