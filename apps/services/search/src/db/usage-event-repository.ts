import { withClient } from '../lib/db.js';

export interface UsageEvent {
  id: number;
  user_id: number;
  type: string;
  meta_json: string | null;
  created_at: string;
}

export const usageEventRepository = {
  async createUsageEvent(
    event: Omit<UsageEvent, 'id' | 'created_at' | 'meta_json'> & {
      meta_json?: any;
    }
  ): Promise<void> {
    return withClient(async (client) => {
      await client.query(
        'INSERT INTO usage_events (user_id, type, meta_json) VALUES ($1, $2, $3)',
        [
          event.user_id,
          event.type,
          event.meta_json ? JSON.stringify(event.meta_json) : null,
        ]
      );
    });
  },
};
