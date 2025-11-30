import type { PrismaClient, ChatMessage, MessageRole } from '@prisma/client';
import type { Citation } from '../types/chat-types.js';

export interface CreateMessageParameters {
  chat_id: number;
  role: MessageRole;
  content: string;
  citations?: Citation[];
}

export const createMessageRepository = (prisma: PrismaClient) => ({
  async getMessagesByChatId(
    chatId: number,
    limit?: number
  ): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: limit ? 'desc' : 'asc' },
      take: limit,
    });
    // If limit was provided, reverse to get chronological order
    return limit ? messages.reverse() : messages;
  },

  async getRecentMessages(
    chatId: number,
    limit: number
  ): Promise<ChatMessage[]> {
    const messages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    // Return in chronological order (oldest first)
    return messages.reverse();
  },

  async createMessage(
    parameters: CreateMessageParameters
  ): Promise<ChatMessage> {
    const { chat_id, role, content, citations } = parameters;
    const citationsJson = citations ? JSON.stringify(citations) : null;

    return prisma.chatMessage.create({
      data: {
        chatId: chat_id,
        role,
        content,
        citationsJson,
      },
    });
  },

  async deleteMessagesByChatId(chatId: number): Promise<void> {
    await prisma.chatMessage.deleteMany({
      where: { chatId },
    });
  },
});
