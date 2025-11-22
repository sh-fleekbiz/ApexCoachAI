import { database } from './database.js';

export const analyticsRepository = {
  getSnapshot(range: '7d' | '30d' | '90d' | '365d') {
    const date = new Date();
    const daysMatch = range.match(/^(\d+)d$/);
    const days = daysMatch ? Number.parseInt(daysMatch[1], 10) : 0;
    date.setDate(date.getDate() - days);
    const dateString = date.toISOString();

    const totalUsers = database.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const activeUsers = database
      .prepare('SELECT COUNT(DISTINCT user_id) as count FROM usage_events WHERE created_at >= ?')
      .get(dateString) as { count: number };
    const totalChats = database.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
    const messagesInPeriod = database
      .prepare('SELECT COUNT(*) as count FROM usage_events WHERE type = ? AND created_at >= ?')
      .get('chat_message', dateString) as { count: number };
    const resourcesIngestedInPeriod = database
      .prepare('SELECT COUNT(*) as count FROM usage_events WHERE type = ? AND created_at >= ?')
      .get('resource_ingested', dateString) as { count: number };

    return {
      totalUsers: totalUsers.count,
      activeUsers: activeUsers.count,
      totalChats: totalChats.count,
      messagesInPeriod: messagesInPeriod.count,
      resourcesIngestedInPeriod: resourcesIngestedInPeriod.count,
    };
  },
};
