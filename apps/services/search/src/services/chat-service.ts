import { chatRepository, type Chat } from '../db/chat-repository.js';
import { messageRepository } from '../db/message-repository.js';
import { metaPromptRepository } from '../db/meta-prompt-repository.js';
import { usageEventRepository } from '../db/usage-event-repository.js';
import { userSettingsRepository } from '../db/user-settings-repository.js';
import type { Citation } from '../types/chat-types.js';

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

export const chatService = {
  async prepareChatContext(
    input: PrepareChatContextInput
  ): Promise<PreparedChatContext> {
    const { chatId, userId, input: messageText, personalityId } = input;

    let chat: Chat | undefined;
    if (chatId) {
      chat = await chatRepository.getChatById(chatId);
      if (!chat || chat.user_id !== userId) {
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
      chat = await chatRepository.createChat({
        user_id: userId,
        title,
      });
    }

    await messageRepository.createMessage({
      chat_id: chat.id,
      role: 'user',
      content: messageText,
    });

    await usageEventRepository.createUsageEvent({
      user_id: userId,
      type: 'chat_message',
      meta_json: { chatId: chat.id, role: 'user' },
    });

    let personalityPromptText = '';
    if (personalityId) {
      const personality = await metaPromptRepository.getMetaPromptById(
        personalityId
      );
      if (personality) {
        personalityPromptText = personality.prompt_text;
      }
    } else {
      const settings = await userSettingsRepository.getUserSettings(userId);
      if (settings?.default_personality_id) {
        const personality = await metaPromptRepository.getMetaPromptById(
          settings.default_personality_id
        );
        if (personality) {
          personalityPromptText = personality.prompt_text;
        }
      } else {
        const defaultPersonality =
          await metaPromptRepository.getDefaultMetaPrompt();
        if (defaultPersonality) {
          personalityPromptText = defaultPersonality.prompt_text;
        }
      }
    }

    const recentDatabaseMessages =
      await messageRepository.getRecentMessages(chat.id, 10);

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

    await messageRepository.createMessage({
      chat_id: chatId,
      role: 'assistant',
      content,
      citations: citations && citations.length > 0 ? citations : undefined,
    });

    await usageEventRepository.createUsageEvent({
      user_id: userId,
      type: 'chat_message',
      meta_json: { chatId, role: 'assistant' },
    });

    await chatRepository.updateChatTimestamp(chatId);
  },
};
