import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';

const exportRoute: FastifyPluginAsync = async (fastify): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Export chat session as markdown
  typedFastify.get(
    '/chats/:chatId/export',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Export chat session as markdown',
        tags: ['export'],
        params: {
          type: 'object',
          properties: {
            chatId: { type: 'string' },
          },
        },
        querystring: {
          type: 'object',
          properties: {
            format: { type: 'string', enum: ['markdown', 'json'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              format: { type: 'string' },
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
      const format = (request.query as { format?: string })?.format || 'markdown';

      // Verify chat belongs to user
      const chat = await fastify.prisma.chat.findFirst({
        where: { id: chatId, userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
          sessionSummary: true,
        },
      });

      if (!chat) {
        return reply.notFound('Chat not found');
      }

      if (format === 'json') {
        return {
          content: JSON.stringify(
            {
              chat: {
                id: chat.id,
                title: chat.title,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt.toISOString(),
              },
              messages: chat.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
                citations: msg.citationsJson ? JSON.parse(msg.citationsJson) : null,
                createdAt: msg.createdAt.toISOString(),
              })),
              summary: chat.sessionSummary
                ? {
                    summary: chat.sessionSummary.summary,
                    keyInsights: chat.sessionSummary.keyInsights,
                    actionItems: chat.sessionSummary.actionItems,
                    topics: chat.sessionSummary.topics,
                  }
                : null,
            },
            null,
            2
          ),
          format: 'json',
        };
      }

      // Markdown format
      let markdown = `# ${chat.title}\n\n`;
      markdown += `**Date:** ${new Date(chat.createdAt).toLocaleDateString()}\n\n`;
      markdown += `---\n\n`;

      chat.messages.forEach((msg) => {
        const role = msg.role === 'USER' ? 'You' : 'Apex Coach';
        markdown += `## ${role}\n\n`;
        markdown += `${msg.content}\n\n`;

        if (msg.citationsJson) {
          try {
            const citations = JSON.parse(msg.citationsJson);
            if (Array.isArray(citations) && citations.length > 0) {
              markdown += `**Sources:**\n`;
              citations.forEach((citation: any, idx: number) => {
                markdown += `${idx + 1}. ${citation.title || citation.sourceId || 'Source'}\n`;
              });
              markdown += `\n`;
            }
          } catch (e) {
            // Ignore citation parsing errors
          }
        }

        markdown += `---\n\n`;
      });

      if (chat.sessionSummary) {
        markdown += `## Session Summary\n\n`;
        markdown += `${chat.sessionSummary.summary}\n\n`;

        if (chat.sessionSummary.topics.length > 0) {
          markdown += `**Topics Covered:** ${chat.sessionSummary.topics.join(', ')}\n\n`;
        }
      }

      markdown += `\n---\n\n`;
      markdown += `*Exported from Apex Coach AI on ${new Date().toLocaleString()}*\n`;

      return {
        content: markdown,
        format: 'markdown',
      };
    }
  );

  // Share chat link (read-only)
  typedFastify.post(
    '/chats/:chatId/share',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Create a shareable link for a chat session',
        tags: ['export'],
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
              shareLink: { type: 'string' },
              expiresAt: { type: ['string', 'null'] },
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

      // Generate a share token (simplified - in production, use proper token generation)
      const shareToken = Buffer.from(`${chatId}:${userId}:${Date.now()}`).toString('base64url');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // In production, store this in a shares table
      // For now, return the share link
      const shareLink = `${process.env.APP_PUBLIC_HOST || 'https://apexcoachai.shtrial.com'}/share/${shareToken}`;

      return {
        shareLink,
        expiresAt: expiresAt.toISOString(),
      };
    }
  );
};

export default exportRoute;

