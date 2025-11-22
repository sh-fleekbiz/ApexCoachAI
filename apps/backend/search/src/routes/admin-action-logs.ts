import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';
import { adminActionLogRepository } from '../db/admin-action-log-repository.js';

const adminActionLogRoutes: FastifyPluginAsync = async (_fastify, _options): Promise<void> => {
  const fastify = _fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get all admin action logs (admin/owner only)
  fastify.get('/api/admin-action-logs', {
    preHandler: [fastify.authenticate, fastify.requireAdmin],
    schema: {
      description: 'Get admin action logs with pagination (admin/owner only)',
      tags: ['admin'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 500, default: 100 },
          offset: { type: 'number', minimum: 0, default: 0 },
          action: { type: 'string' },
          userId: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            logs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  userId: { type: 'number' },
                  action: { type: 'string' },
                  entityType: { type: ['string', 'null'] },
                  entityId: { type: ['number', 'null'] },
                  description: { type: ['string', 'null'] },
                  metadata: { type: 'object', additionalProperties: true },
                  createdAt: { type: 'string' },
                },
              },
            },
            total: { type: 'number' },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      const { limit, offset, action, userId } = request.query as {
        limit?: number;
        offset?: number;
        action?: string;
        userId?: number;
      };

      try {
        let logs;

        if (userId) {
          logs = adminActionLogRepository.getLogsByUserId(userId, limit || 100);
        } else if (action) {
          logs = adminActionLogRepository.getLogsByAction(action, limit || 100);
        } else {
          logs = adminActionLogRepository.getAllLogs(limit || 100, offset || 0);
        }

        const total = adminActionLogRepository.getLogsCount();

        const formattedLogs = logs.map((log) => ({
          id: log.id,
          userId: log.user_id,
          action: log.action,
          entityType: log.entity_type,
          entityId: log.entity_id,
          description: log.description,
          metadata: log.meta_json ? JSON.parse(log.meta_json) : {},
          createdAt: log.created_at,
        }));

        return reply.send({
          logs: formattedLogs,
          total,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Failed to retrieve admin action logs');
      }
    },
  });

  // Get logs for a specific user (admin/owner only)
  fastify.get('/api/admin-action-logs/user/:userId', {
    preHandler: [fastify.authenticate, fastify.requireAdmin],
    schema: {
      description: 'Get admin action logs for a specific user (admin/owner only)',
      tags: ['admin'],
      params: {
        type: 'object',
        properties: {
          userId: { type: 'number' },
        },
        required: ['userId'],
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 500, default: 100 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            logs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  action: { type: 'string' },
                  entityType: { type: ['string', 'null'] },
                  entityId: { type: ['number', 'null'] },
                  description: { type: ['string', 'null'] },
                  metadata: { type: 'object', additionalProperties: true },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      const { userId } = request.params as { userId: number };
      const { limit } = request.query as { limit?: number };

      try {
        const logs = adminActionLogRepository.getLogsByUserId(userId, limit || 100);

        const formattedLogs = logs.map((log) => ({
          id: log.id,
          action: log.action,
          entityType: log.entity_type,
          entityId: log.entity_id,
          description: log.description,
          metadata: log.meta_json ? JSON.parse(log.meta_json) : {},
          createdAt: log.created_at,
        }));

        return reply.send({ logs: formattedLogs });
      } catch (error) {
        fastify.log.error(error);
        return reply.internalServerError('Failed to retrieve admin action logs');
      }
    },
  });
};

export default adminActionLogRoutes;
