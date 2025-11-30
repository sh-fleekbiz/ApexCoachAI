// Export repository factories
import type { PrismaClient } from '@prisma/client';
import { createUserRepository } from './user-repository.js';
import { createChatRepository } from './chat-repository.js';
import { createMessageRepository } from './message-repository.js';
import { createMetaPromptRepository } from './meta-prompt-repository.js';
import { createUserSettingsRepository } from './user-settings-repository.js';
import { createAdminActionLogRepository } from './admin-action-log-repository.js';
import { createWhiteLabelSettingsRepository } from './white-label-settings-repository.js';
import { createInvitationRepository } from './invitation-repository.js';
import { createProgramRepository } from './program-repository.js';
import { createUsageEventRepository } from './usage-event-repository.js';
import { createKnowledgeBaseRepository } from './knowledge-base-repository.js';
import { createKnowledgeBaseSectionsRepository } from './knowledge-base-sections-repository.js';
import { createAnalyticsRepository } from './analytics-repository.js';

export function createRepositories(prisma: PrismaClient) {
  return {
    user: createUserRepository(prisma),
    chat: createChatRepository(prisma),
    message: createMessageRepository(prisma),
    metaPrompt: createMetaPromptRepository(prisma),
    userSettings: createUserSettingsRepository(prisma),
    adminActionLog: createAdminActionLogRepository(prisma),
    whiteLabelSettings: createWhiteLabelSettingsRepository(prisma),
    invitation: createInvitationRepository(prisma),
    program: createProgramRepository(prisma),
    usageEvent: createUsageEventRepository(prisma),
    knowledgeBase: createKnowledgeBaseRepository(prisma),
    knowledgeBaseSections: createKnowledgeBaseSectionsRepository(prisma),
    analytics: createAnalyticsRepository(prisma),
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
