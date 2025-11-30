import type { PrismaClient, Chat } from '@prisma/client';
import type { Citation } from '../types/chat-types.js';
import { createRepositories } from '../db/index.js';

export interface PrepareChatContextInput {
  chatId?: number | null;
  userId: number;
  input: string;
  personalityId?: number | null;
}

export interface PreparedChatContext {
  chat: Chat;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export const createChatService = (prisma: PrismaClient) => {
  const repos = createRepositories(prisma);
  
  return {
    async prepareChatContext(
      input: PrepareChatContextInput
    ): Promise<PreparedChatContext> {
      const { chatId, userId, input: messageText, personalityId } = input;

      let chat: Chat | null;
      if (chatId) {
        chat = await repos.chat.getChatById(chatId);
        if (!chat || chat.userId !== userId) {
        throw {
          status: 403,
          error: { error: 'Forbidden' },
          message: 'Forbidden',
        };
      }
    } else {
      const title =
        messageText.length > 50
          ? messageText.slice(0, 50) + '...'
          : messageText;
      chat = await repos.chat.createChat({
        user_id: userId,
        title,
      });
    }

    await repos.message.createMessage({
      chat_id: chat.id,
      role: 'USER',
      content: messageText,
    });

    await repos.usageEvent.createUsageEvent({
      user_id: userId,
      type: 'chat_message',
      meta_json: { chatId: chat.id, role: 'user' },
    });

    let personalityPromptText = '';
    if (personalityId) {
      const personality = await repos.metaPrompt.getMetaPromptById(
        personalityId
      );
      if (personality) {
        personalityPromptText = personality.promptText;
      }
    } else {
      const settings = await repos.userSettings.getUserSettings(userId);
      if (settings?.defaultPersonalityId) {
        const personality = await repos.metaPrompt.getMetaPromptById(
          settings.defaultPersonalityId
        );
        if (personality) {
          personalityPromptText = personality.promptText;
        }
      } else {
        const defaultPersonality =
          await repos.metaPrompt.getDefaultMetaPrompt();
        if (defaultPersonality) {
          personalityPromptText = defaultPersonality.promptText;
        }
      }
    }

    const recentDatabaseMessages =
      await repos.message.getRecentMessages(chat.id, 10);

    const messages: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }> = [];

    if (personalityPromptText) {
      messages.push({
        role: 'system',
        content: personalityPromptText,
      });
    }

    for (const message of recentDatabaseMessages) {
      if (message.role !== 'system') {
        messages.push({
          role: message.role as 'user' | 'assistant',
          content: message.content,
        });
      }
    }

    return { chat, messages };
  },

  async saveAssistantMessageAndLogUsage(params: {
    chatId: number;
    userId: number;
    content: string;
    citations?: Citation[];
  }): Promise<void> {
    const { chatId, userId, content, citations } = params;

    if (!content) {
      return;
    }

    await repos.message.createMessage({
      chat_id: chatId,
      role: 'ASSISTANT',
      content,
      citations: citations && citations.length > 0 ? citations : undefined,
    });

    await repos.usageEvent.createUsageEvent({
      user_id: userId,
      type: 'chat_message',
      meta_json: { chatId, role: 'assistant' },
    });

    await repos.chat.updateChatTimestamp(chatId);
  },
  };
};
