import type { PrismaClient, AdminActionLog } from '@prisma/client';

export interface CreateAdminActionLogParameters {
  user_id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  description?: string;
  meta_json?: Record<string, any>;
}

export const createAdminActionLogRepository = (prisma: PrismaClient) => ({
  async createLog(
    parameters: CreateAdminActionLogParameters
  ): Promise<AdminActionLog> {
    const { user_id, action, entity_type, entity_id, description, meta_json } =
      parameters;
    return prisma.adminActionLog.create({
      data: {
        userId: user_id,
        action,
        entityType: entity_type ?? null,
        entityId: entity_id ?? null,
        description: description ?? null,
        metaJson: meta_json ? JSON.stringify(meta_json) : null,
      },
    });
  },

  async getLogById(id: number): Promise<AdminActionLog | null> {
    return prisma.adminActionLog.findUnique({
      where: { id },
    });
  },

  async getLogsByUserId(
    userId: number,
    limit = 100
  ): Promise<AdminActionLog[]> {
    return prisma.adminActionLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getLogsByAction(
    action: string,
    limit = 100
  ): Promise<AdminActionLog[]> {
    return prisma.adminActionLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getAllLogs(limit = 100, offset = 0): Promise<AdminActionLog[]> {
    return prisma.adminActionLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  },

  async getLogsCount(): Promise<number> {
    return prisma.adminActionLog.count();
  },
});
