import { withClient } from '../lib/db.js';

export const analyticsRepository = {
  async getSnapshot(range: '7d' | '30d' | '90d' | '365d') {
    const date = new Date();
    const daysMatch = range.match(/^(\d+)d$/);
    const days = daysMatch ? Number.parseInt(daysMatch[1], 10) : 0;
    date.setDate(date.getDate() - days);
    const dateString = date.toISOString();

    return withClient(async (client) => {
      const totalUsersResult = await client.query(
        'SELECT COUNT(*) as count FROM users'
      );
      const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);

      const activeUsersResult = await client.query(
        'SELECT COUNT(DISTINCT user_id) as count FROM usage_events WHERE created_at >= $1',
        [dateString]
      );
      const activeUsers = parseInt(activeUsersResult.rows[0].count, 10);

      const totalChatsResult = await client.query(
        'SELECT COUNT(*) as count FROM chats'
      );
      const totalChats = parseInt(totalChatsResult.rows[0].count, 10);

      const messagesResult = await client.query(
        'SELECT COUNT(*) as count FROM usage_events WHERE type = $1 AND created_at >= $2',
        ['chat_message', dateString]
      );
      const messagesInPeriod = parseInt(messagesResult.rows[0].count, 10);

      const resourcesResult = await client.query(
        'SELECT COUNT(*) as count FROM usage_events WHERE type = $1 AND created_at >= $2',
        ['resource_ingested', dateString]
      );
      const resourcesIngestedInPeriod = parseInt(
        resourcesResult.rows[0].count,
        10
      );

      return {
        totalUsers,
        activeUsers,
        totalChats,
        messagesInPeriod,
        resourcesIngestedInPeriod,
      };
    });
  },
};
