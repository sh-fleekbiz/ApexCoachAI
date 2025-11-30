import type { PrismaClient, Chat } from '@prisma/client';

export interface CreateChatParameters {
  user_id: number;
  title: string;
}

export const createChatRepository = (prisma: PrismaClient) => ({
  async getChatsByUserId(userId: number): Promise<Chat[]> {
    return prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getChatById(chatId: number): Promise<Chat | null> {
    return prisma.chat.findUnique({
      where: { id: chatId },
    });
  },

  async createChat(parameters: CreateChatParameters): Promise<Chat> {
    const { user_id, title } = parameters;
    return prisma.chat.create({
      data: {
        userId: user_id,
        title,
      },
    });
  },

  async updateChatTimestamp(chatId: number): Promise<void> {
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });
  },

  async updateChatTitle(chatId: number, title: string): Promise<void> {
    await prisma.chat.update({
      where: { id: chatId },
      data: { title, updatedAt: new Date() },
    });
  },

  async deleteChat(chatId: number): Promise<void> {
    await prisma.chat.delete({
      where: { id: chatId },
    });
  },

  async deleteAllChatsForUser(userId: number): Promise<void> {
    await prisma.chat.deleteMany({
      where: { userId },
    });
  },

  async getChatsForUser(userId: number): Promise<Chat[]> {
    return prisma.chat.findMany({
      where: { userId },
    });
  },
});
