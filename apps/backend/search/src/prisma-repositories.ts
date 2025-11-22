import {
  PrismaClient,
  type User,
  type Chat,
  type ChatMessage,
  type MetaPrompt,
  type Invitation,
  type Program,
  type UserSettings,
  type Role,
  type MessageRole,
  type InvitationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

// Type definitions matching the existing interfaces
export interface CreateUserParameters {
  email: string;
  password_hash: string;
  name?: string;
}

export const prismaUserRepository = {
  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async getUserById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async createUser(parameters: CreateUserParameters): Promise<User> {
    const { email, password_hash, name } = parameters;
    return await prisma.user.create({
      data: {
        email,
        passwordHash: password_hash,
        name: name || undefined,
      },
    });
  },

  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateUserRole(id: number, role: Role): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { role },
    });
  },

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },
};

export const prismaChatRepository = {
  async getChatsByUserId(userId: number) {
    return await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  },

  async getChatById(id: number): Promise<Chat | null> {
    return await prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  async createChat(userId: number, title: string): Promise<Chat> {
    return await prisma.chat.create({
      data: {
        userId,
        title,
      },
    });
  },

  async updateChatTitle(id: number, title: string): Promise<void> {
    await prisma.chat.update({
      where: { id },
      data: { title },
    });
  },

  async deleteChat(id: number): Promise<void> {
    await prisma.chat.delete({
      where: { id },
    });
  },

  async updateChatTimestamp(id: number): Promise<void> {
    await prisma.chat.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  },
};

export const prismaMessageRepository = {
  async getMessagesByChatId(chatId: number) {
    return await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async createMessage(
    chatId: number,
    role: MessageRole,
    content: string,
    citationsJson?: string,
  ): Promise<ChatMessage> {
    return await prisma.chatMessage.create({
      data: {
        chatId,
        role,
        content,
        citationsJson: citationsJson || undefined,
      },
    });
  },

  async deleteMessagesByChatId(chatId: number): Promise<void> {
    await prisma.chatMessage.deleteMany({
      where: { chatId },
    });
  },
};

export const prismaMetaPromptRepository = {
  async getAllPrompts() {
    return await prisma.metaPrompt.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getDefaultPrompt(): Promise<MetaPrompt | null> {
    return await prisma.metaPrompt.findFirst({
      where: { isDefault: true },
    });
  },

  async createPrompt(name: string, promptText: string, isDefault: boolean = false): Promise<MetaPrompt> {
    return await prisma.metaPrompt.create({
      data: {
        name,
        promptText,
        isDefault,
      },
    });
  },

  async updatePrompt(id: number, name: string, promptText: string, isDefault: boolean): Promise<void> {
    await prisma.metaPrompt.update({
      where: { id },
      data: { name, promptText, isDefault },
    });
  },

  async deletePrompt(id: number): Promise<void> {
    await prisma.metaPrompt.delete({
      where: { id },
    });
  },
};

export const prismaInvitationRepository = {
  async getAllInvitations() {
    return await prisma.invitation.findMany({
      include: {
        invitedByUser: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async createInvitation(data: { email: string; role: Role; invited_by_user_id: number }): Promise<Invitation> {
    return await prisma.invitation.create({
      data: {
        email: data.email,
        role: data.role,
        invitedByUserId: data.invited_by_user_id,
      },
    });
  },

  async getInvitationById(id: number): Promise<Invitation | null> {
    return await prisma.invitation.findUnique({
      where: { id },
      include: {
        invitedByUser: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  },

  async updateInvitationStatus(id: number, status: InvitationStatus): Promise<void> {
    await prisma.invitation.update({
      where: { id },
      data: {
        status,
        acceptedAt: status === 'ACCEPTED' ? new Date() : undefined,
      },
    });
  },

  async deleteInvitation(id: number): Promise<void> {
    await prisma.invitation.delete({
      where: { id },
    });
  },
};

export const prismaProgramRepository = {
  async getAllPrograms() {
    return await prisma.program.findMany({
      include: {
        createdByUser: {
          select: { id: true, email: true, name: true },
        },
        assignments: {
          include: {
            user: {
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getProgramById(id: number) {
    return await prisma.program.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: { id: true, email: true, name: true },
        },
        assignments: {
          include: {
            user: {
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
    });
  },

  async createProgram(data: { name: string; description?: string; created_by_user_id: number }): Promise<Program> {
    return await prisma.program.create({
      data: {
        name: data.name,
        description: data.description || undefined,
        createdByUserId: data.created_by_user_id,
      },
    });
  },

  async updateProgram(id: number, name: string, description?: string): Promise<void> {
    await prisma.program.update({
      where: { id },
      data: {
        name,
        description: description || undefined,
      },
    });
  },

  async deleteProgram(id: number): Promise<void> {
    await prisma.program.delete({
      where: { id },
    });
  },
};

export const prismaUsageEventRepository = {
  async createUsageEvent(data: { user_id: number; type: string; meta_json?: any }): Promise<void> {
    await prisma.usageEvent.create({
      data: {
        userId: data.user_id,
        type: data.type,
        metaJson: data.meta_json ? JSON.stringify(data.meta_json) : undefined,
      },
    });
  },

  async getUsageEventsByUserId(userId: number, limit?: number) {
    return await prisma.usageEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getSnapshot(range: string = '7d') {
    // Calculate date range
    const now = new Date();
    const daysAgo = Number.parseInt(range.replaceAll(/\D/g, ''), 10) || 7;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const [totalUsers, activeUsers, totalChats, messagesInPeriod] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          chats: {
            some: {
              updatedAt: {
                gte: startDate,
              },
            },
          },
        },
      }),
      prisma.chat.count(),
      prisma.chatMessage.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalChats,
      messagesInPeriod,
      resourcesIngestedInPeriod: 0, // Placeholder for future implementation
    };
  },
};

export const prismaUserSettingsRepository = {
  async getUserSettings(userId: number): Promise<UserSettings | null> {
    return await prisma.userSettings.findUnique({
      where: { userId },
      include: {
        defaultPersonality: true,
      },
    });
  },

  async createUserSettings(
    userId: number,
    data: { default_personality_id?: number; nickname?: string; occupation?: string },
  ): Promise<UserSettings> {
    return await prisma.userSettings.create({
      data: {
        userId,
        defaultPersonalityId: data.default_personality_id || undefined,
        nickname: data.nickname || undefined,
        occupation: data.occupation || undefined,
      },
    });
  },

  async updateUserSettings(
    userId: number,
    data: { default_personality_id?: number; nickname?: string; occupation?: string },
  ): Promise<void> {
    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        defaultPersonalityId: data.default_personality_id || undefined,
        nickname: data.nickname || undefined,
        occupation: data.occupation || undefined,
      },
      create: {
        userId,
        defaultPersonalityId: data.default_personality_id || undefined,
        nickname: data.nickname || undefined,
        occupation: data.occupation || undefined,
      },
    });
  },
};

export { prisma };
