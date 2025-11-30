import type { PrismaClient } from '@prisma/client';

export const createAnalyticsRepository = (prisma: PrismaClient) => ({
  async getSnapshot(range: '7d' | '30d' | '90d' | '365d') {
    const date = new Date();
    const daysMatch = range.match(/^(\d+)d$/);
    const days = daysMatch ? Number.parseInt(daysMatch[1], 10) : 0;
    date.setDate(date.getDate() - days);

    const [totalUsers, activeUsers, totalChats, messagesInPeriod, resourcesIngestedInPeriod] = await Promise.all([
      prisma.user.count(),
      prisma.usageEvent.findMany({
        where: { createdAt: { gte: date } },
        select: { userId: true },
        distinct: ['userId'],
      }).then((events) => events.length),
      prisma.chat.count(),
      prisma.usageEvent.count({
        where: {
          type: 'chat_message',
          createdAt: { gte: date },
        },
      }),
      prisma.usageEvent.count({
        where: {
          type: 'resource_ingested',
          createdAt: { gte: date },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalChats,
      messagesInPeriod,
      resourcesIngestedInPeriod,
    };
  },
});
