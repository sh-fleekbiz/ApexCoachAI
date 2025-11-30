import type { PrismaClient, WhiteLabelSettings } from '@prisma/client';

export interface UpdateWhiteLabelSettingsParameters {
  logo_url?: string | null;
  brand_color?: string | null;
  app_name?: string | null;
  custom_css?: string | null;
}

export const createWhiteLabelSettingsRepository = (prisma: PrismaClient) => ({
  async getSettings(): Promise<WhiteLabelSettings | null> {
    return prisma.whiteLabelSettings.findFirst({
      orderBy: { id: 'asc' },
    });
  },

  async updateSettings(
    parameters: UpdateWhiteLabelSettingsParameters
  ): Promise<WhiteLabelSettings> {
    const existing = await prisma.whiteLabelSettings.findFirst({
      orderBy: { id: 'asc' },
    });

    if (existing) {
      return prisma.whiteLabelSettings.update({
        where: { id: existing.id },
        data: {
          logoUrl: parameters.logo_url ?? undefined,
          brandColor: parameters.brand_color ?? undefined,
          appName: parameters.app_name ?? undefined,
          customCss: parameters.custom_css ?? undefined,
        },
      });
    } else {
      return prisma.whiteLabelSettings.create({
        data: {
          logoUrl: parameters.logo_url ?? null,
          brandColor: parameters.brand_color ?? null,
          appName: parameters.app_name ?? null,
          customCss: parameters.custom_css ?? null,
        },
      });
    }
  },

  async resetSettings(): Promise<void> {
    await prisma.whiteLabelSettings.deleteMany();
  },
});
