import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';

const insights: FastifyPluginAsync = async (fastify): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get session summary for a chat
  typedFastify.get(
    '/chats/:chatId/summary',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get session summary for a chat',
        tags: ['insights'],
        params: {
          type: 'object',
          properties: {
            chatId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              summary: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  summary: { type: 'string' },
                  keyInsights: { type: ['object', 'null'] },
                  actionItems: { type: ['object', 'null'] },
                  topics: { type: 'array', items: { type: 'string' } },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
          404: { $ref: 'httpError' },
          401: { $ref: 'httpError' },
          403: { $ref: 'httpError' },
        },
      },
    },
    async function (request, reply) {
      const userId = request.user!.id;
      const chatId = Number((request.params as { chatId: string }).chatId);
      if (isNaN(chatId)) {
        return reply.badRequest('Invalid chat ID');
      }

      // Verify chat belongs to user
      const chat = await fastify.prisma.chat.findFirst({
        where: { id: chatId, userId },
      });

      if (!chat) {
        return reply.notFound('Chat not found');
      }

      const sessionSummary = await fastify.prisma.sessionSummary.findUnique({
        where: { chatId },
      });

      if (!sessionSummary) {
        return reply.notFound('Session summary not found');
      }

      return {
        summary: {
          id: sessionSummary.id,
          summary: sessionSummary.summary,
          keyInsights: sessionSummary.keyInsights as any,
          actionItems: sessionSummary.actionItems as any,
          topics: sessionSummary.topics,
          createdAt: sessionSummary.createdAt.toISOString(),
        },
      };
    }
  );

  // Generate session summary for a chat (using AI)
  typedFastify.post(
    '/chats/:chatId/summarize',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Generate session summary for a chat',
        tags: ['insights'],
        params: {
          type: 'object',
          properties: {
            chatId: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              summary: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  summary: { type: 'string' },
                  keyInsights: { type: ['object', 'null'] },
                  actionItems: { type: ['object', 'null'] },
                  topics: { type: 'array', items: { type: 'string' } },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
          404: { $ref: 'httpError' },
          401: { $ref: 'httpError' },
          403: { $ref: 'httpError' },
          500: { $ref: 'httpError' },
        },
      },
    },
    async function (request, reply) {
      const userId = request.user!.id;
      const chatId = Number((request.params as { chatId: string }).chatId);
      if (isNaN(chatId)) {
        return reply.badRequest('Invalid chat ID');
      }

      // Verify chat belongs to user
      const chat = await fastify.prisma.chat.findFirst({
        where: { id: chatId, userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!chat) {
        return reply.notFound('Chat not found');
      }

      // Check if summary already exists
      const existingSummary = await fastify.prisma.sessionSummary.findUnique({
        where: { chatId },
      });

      if (existingSummary) {
        return {
          summary: {
            id: existingSummary.id,
            summary: existingSummary.summary,
            keyInsights: existingSummary.keyInsights as any,
            actionItems: existingSummary.actionItems as any,
            topics: existingSummary.topics,
            createdAt: existingSummary.createdAt.toISOString(),
          },
        };
      }

      // Generate summary using AI (simplified - in production, use Azure OpenAI)
      // For now, create a basic summary
      const messages = chat.messages;
      const userMessages = messages.filter((m) => m.role === 'USER');
      const assistantMessages = messages.filter((m) => m.role === 'ASSISTANT');

      // Extract topics from messages (simplified)
      const topics: string[] = [];
      const allContent = messages.map((m) => m.content).join(' ');
      // Simple topic extraction (in production, use AI)
      if (allContent.toLowerCase().includes('communication')) topics.push('Communication');
      if (allContent.toLowerCase().includes('relationship')) topics.push('Relationships');
      if (allContent.toLowerCase().includes('goal')) topics.push('Goal Setting');
      if (allContent.toLowerCase().includes('habit')) topics.push('Habits');

      const summary = `This coaching session included ${userMessages.length} exchanges covering ${topics.length > 0 ? topics.join(', ') : 'various topics'}. The conversation focused on ${userMessages[0]?.content.substring(0, 100) || 'coaching topics'}.`;

      const keyInsights = {
        messageCount: messages.length,
        topics: topics.length > 0 ? topics : ['General Coaching'],
        engagement: messages.length > 5 ? 'High' : messages.length > 2 ? 'Medium' : 'Low',
      };

      const actionItems = {
        items: assistantMessages
          .filter((m) => m.content.toLowerCase().includes('action') || m.content.toLowerCase().includes('step'))
          .slice(0, 3)
          .map((m, idx) => ({
            id: idx + 1,
            text: m.content.substring(0, 150),
          })),
      };

      const sessionSummary = await fastify.prisma.sessionSummary.create({
        data: {
          chatId,
          userId,
          summary,
          keyInsights: keyInsights as any,
          actionItems: actionItems as any,
          topics: topics.length > 0 ? topics : ['General Coaching'],
        },
      });

      return {
        summary: {
          id: sessionSummary.id,
          summary: sessionSummary.summary,
          keyInsights: sessionSummary.keyInsights as any,
          actionItems: sessionSummary.actionItems as any,
          topics: sessionSummary.topics,
          createdAt: sessionSummary.createdAt.toISOString(),
        },
      };
    }
  );

  // Get insights dashboard data
  typedFastify.get(
    '/insights/dashboard',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get insights dashboard data',
        tags: ['insights'],
        response: {
          200: {
            type: 'object',
            properties: {
              totalSessions: { type: 'number' },
              totalMessages: { type: 'number' },
              topTopics: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    topic: { type: 'string' },
                    count: { type: 'number' },
                  },
                },
              },
              recentSummaries: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    chatId: { type: 'number' },
                    summary: { type: 'string' },
                    topics: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string' },
                  },
                },
              },
            },
          },
          401: { $ref: 'httpError' },
        },
      },
    },
    async function (request, reply) {
      const userId = request.user!.id;

      const chats = await fastify.prisma.chat.findMany({
        where: { userId },
        include: {
          messages: true,
          sessionSummary: true,
        },
      });

      const totalSessions = chats.length;
      const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);

      // Extract topics from summaries
      const topicCounts = new Map<string, number>();
      chats.forEach((chat) => {
        if (chat.sessionSummary) {
          chat.sessionSummary.topics.forEach((topic) => {
            topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
          });
        }
      });

      const topTopics = Array.from(topicCounts.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const recentSummaries = chats
        .filter((chat) => chat.sessionSummary)
        .map((chat) => ({
          id: chat.sessionSummary!.id,
          chatId: chat.id,
          summary: chat.sessionSummary!.summary.substring(0, 200),
          topics: chat.sessionSummary!.topics,
          createdAt: chat.sessionSummary!.createdAt.toISOString(),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      return {
        totalSessions,
        totalMessages,
        topTopics,
        recentSummaries,
      };
    }
  );
};

export default insights;

