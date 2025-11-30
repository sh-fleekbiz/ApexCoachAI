import type { PrismaClient } from '@prisma/client';

export const createUsageEventRepository = (prisma: PrismaClient) => ({
  async createUsageEvent(
    event: {
      user_id: number;
      type: string;
      meta_json?: any;
    }
  ): Promise<void> {
    await prisma.usageEvent.create({
      data: {
        userId: event.user_id,
        type: event.type,
        metaJson: event.meta_json ? JSON.stringify(event.meta_json) : null,
      },
    });
  },
});
