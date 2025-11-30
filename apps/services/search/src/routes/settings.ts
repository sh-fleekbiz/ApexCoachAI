import { type FastifyPluginAsync } from 'fastify';
import { createRepositories } from '../db/index.js';

const settings: FastifyPluginAsync = async (
  fastify,
  _options
): Promise<void> => {
  const repos = createRepositories(fastify.prisma);
  // Get all meta prompts (personalities) - public endpoint for frontend initialization
  fastify.get('/meta-prompts', {
    schema: {
      description: 'Get all meta prompts (personalities)',
      tags: ['settings'],
      response: {
        200: {
          type: 'object',
          properties: {
            metaPrompts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  promptText: { type: 'string' },
                  isDefault: { type: 'boolean' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
      },
    },
    handler: async function (_request, _reply) {
      const metaPrompts = await repos.metaPrompt.getAllMetaPrompts();

      return {
        metaPrompts: metaPrompts.map((mp) => ({
          id: mp.id,
          name: mp.name,
          promptText: mp.promptText,
          isDefault: mp.isDefault,
          createdAt: mp.createdAt,
        })),
      };
    },
  });

  // Get user settings
  fastify.get('/me/settings', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Get current user settings',
      tags: ['settings'],
      response: {
        200: {
          type: 'object',
          properties: {
            settings: {
              type: 'object',
              properties: {
                userId: { type: 'number' },
                defaultPersonalityId: { type: ['number', 'null'] },
                nickname: { type: ['string', 'null'] },
                occupation: { type: ['string', 'null'] },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
      },
    },
    handler: async function (request, _reply) {
      let settings = await repos.userSettings.getUserSettings(
        request.user!.id
      );

      // If no settings exist, create default ones
      if (!settings) {
        settings = await repos.userSettings.upsertUserSettings({
          user_id: request.user!.id,
        });
      }

      return {
        settings: {
          userId: settings.userId,
          defaultPersonalityId: settings.defaultPersonalityId,
          nickname: settings.nickname,
          occupation: settings.occupation,
        },
      };
    },
  });

  // Update user settings
  fastify.put('/me/settings', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Update current user settings',
      tags: ['settings'],
      body: {
        type: 'object',
        properties: {
          defaultPersonalityId: { type: ['number', 'null'] },
          nickname: { type: ['string', 'null'] },
          occupation: { type: ['string', 'null'] },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            settings: {
              type: 'object',
              properties: {
                userId: { type: 'number' },
                defaultPersonalityId: { type: ['number', 'null'] },
                nickname: { type: ['string', 'null'] },
                occupation: { type: ['string', 'null'] },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
      },
    },
    handler: async function (request, _reply) {
      const body = request.body as {
        defaultPersonalityId?: number | null;
        nickname?: string | null;
        occupation?: string | null;
      };

      const settings = await repos.userSettings.upsertUserSettings({
        user_id: request.user!.id,
        default_personality_id: body.defaultPersonalityId,
        nickname: body.nickname,
        occupation: body.occupation,
      });

      return {
        settings: {
          userId: settings.userId,
          defaultPersonalityId: settings.defaultPersonalityId,
          nickname: settings.nickname,
          occupation: settings.occupation,
        },
      };
    },
  });
};

export default settings;
