import type { PrismaClient, MetaPrompt } from '@prisma/client';

export interface CreateMetaPromptParameters {
  name: string;
  prompt_text: string;
  is_default?: boolean;
}

export const createMetaPromptRepository = (prisma: PrismaClient) => ({
  async getAllMetaPrompts(): Promise<MetaPrompt[]> {
    return prisma.metaPrompt.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getMetaPromptById(id: number): Promise<MetaPrompt | null> {
    return prisma.metaPrompt.findUnique({
      where: { id },
    });
  },

  async getDefaultMetaPrompt(): Promise<MetaPrompt | null> {
    return prisma.metaPrompt.findFirst({
      where: { isDefault: true },
    });
  },

  async createMetaPrompt(
    parameters: CreateMetaPromptParameters
  ): Promise<MetaPrompt> {
    const { name, prompt_text, is_default } = parameters;

    // If setting as default, unset other defaults first
    if (is_default) {
      await prisma.metaPrompt.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.metaPrompt.create({
      data: {
        name,
        promptText: prompt_text,
        isDefault: is_default ?? false,
      },
    });
  },

  async updateMetaPrompt(
    id: number,
    parameters: Partial<CreateMetaPromptParameters>
  ): Promise<void> {
    const { name, prompt_text, is_default } = parameters;

    // If setting as default, unset other defaults first
    if (is_default) {
      await prisma.metaPrompt.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const updateData: Partial<{
      name: string;
      promptText: string;
      isDefault: boolean;
    }> = {};

    if (name !== undefined) updateData.name = name;
    if (prompt_text !== undefined) updateData.promptText = prompt_text;
    if (is_default !== undefined) updateData.isDefault = is_default;

    if (Object.keys(updateData).length > 0) {
      await prisma.metaPrompt.update({
        where: { id },
        data: updateData,
      });
    }
  },

  async deleteMetaPrompt(id: number): Promise<void> {
    await prisma.metaPrompt.delete({
      where: { id },
    });
  },
});
