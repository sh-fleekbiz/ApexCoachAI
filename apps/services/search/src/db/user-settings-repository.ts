import type { PrismaClient, UserSettings } from '@prisma/client';

export interface UpsertUserSettingsParameters {
  user_id: number;
  default_personality_id?: number | null;
  nickname?: string | null;
  occupation?: string | null;
}

export const createUserSettingsRepository = (prisma: PrismaClient) => ({
  async getUserSettings(userId: number): Promise<UserSettings | null> {
    return prisma.userSettings.findUnique({
      where: { userId },
    });
  },

  async upsertUserSettings(
    parameters: UpsertUserSettingsParameters
  ): Promise<UserSettings> {
    const { user_id, default_personality_id, nickname, occupation } =
      parameters;

    return prisma.userSettings.upsert({
      where: { userId: user_id },
      update: {
        defaultPersonalityId: default_personality_id ?? null,
        nickname: nickname ?? null,
        occupation: occupation ?? null,
      },
      create: {
        userId: user_id,
        defaultPersonalityId: default_personality_id ?? null,
        nickname: nickname ?? null,
        occupation: occupation ?? null,
      },
    });
  },

  async deleteUserSettings(userId: number): Promise<void> {
    await prisma.userSettings.delete({
      where: { userId },
    });
  },
});
