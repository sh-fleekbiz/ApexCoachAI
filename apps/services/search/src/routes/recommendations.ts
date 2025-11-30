import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';

const recommendations: FastifyPluginAsync = async (fastify): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get content recommendations
  typedFastify.get(
    '/recommendations/content',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get content recommendations based on user chat history',
        tags: ['recommendations'],
        response: {
          200: {
            type: 'object',
            properties: {
              recommendations: {
                type: 'object',
                properties: {
                  libraryResources: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        type: { type: 'string' },
                        reason: { type: 'string' },
                      },
                    },
                  },
                  personalities: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        reason: { type: 'string' },
                      },
                    },
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

      // Get user's chat history and topics
      const chats = await fastify.prisma.chat.findMany({
        where: { userId },
        include: {
          messages: true,
          sessionSummary: true,
        },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      });

      // Extract topics from recent chats
      const topics = new Set<string>();
      chats.forEach((chat) => {
        if (chat.sessionSummary) {
          chat.sessionSummary.topics.forEach((topic) => topics.add(topic));
        }
      });

      // Get library resources (simplified - in production, use vector search)
      const libraryResources = await fastify.prisma.libraryResource.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      // Get personalities
      const personalities = await fastify.prisma.metaPrompt.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      // Generate recommendations based on topics
      const recommendedResources = libraryResources.slice(0, 3).map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        reason: `Recommended based on your interest in coaching topics`,
      }));

      const recommendedPersonalities = personalities.slice(0, 2).map((personality) => ({
        id: personality.id,
        name: personality.name,
        reason: `Matches your coaching style preferences`,
      }));

      return {
        recommendations: {
          libraryResources: recommendedResources,
          personalities: recommendedPersonalities,
        },
      };
    }
  );
};

export default recommendations;

