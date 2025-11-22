import { database } from './database.js';

export interface UsageEvent {
  id: number;
  user_id: number;
  type: string;
  meta_json: string | null;
  created_at: string;
}

export const usageEventRepository = {
  createUsageEvent(event: Omit<UsageEvent, 'id' | 'created_at' | 'meta_json'> & { meta_json?: any }) {
    const stmt = database.prepare('INSERT INTO usage_events (user_id, type, meta_json) VALUES (?, ?, ?)');
    stmt.run(event.user_id, event.type, event.meta_json ? JSON.stringify(event.meta_json) : undefined);
  },
};
