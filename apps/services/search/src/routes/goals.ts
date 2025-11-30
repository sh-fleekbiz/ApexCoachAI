import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';

const goals: FastifyPluginAsync = async (fastify): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get all goals for the current user
  typedFastify.get(
    '/goals',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get all goals for the current user',
        tags: ['goals'],
        response: {
          200: {
            type: 'object',
            properties: {
              goals: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    description: { type: ['string', 'null'] },
                    status: { type: 'string' },
                    targetDate: { type: ['string', 'null'] },
                    createdAt: { type: 'string' },
                    updatedAt: { type: 'string' },
                    completedAt: { type: ['string', 'null'] },
                    milestones: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          title: { type: 'string' },
                          description: { type: ['string', 'null'] },
                          status: { type: 'string' },
                          targetDate: { type: ['string', 'null'] },
                          completedAt: { type: ['string', 'null'] },
                        },
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

      const goals = await fastify.prisma.goal.findMany({
        where: { userId },
        include: {
          milestones: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        goals: goals.map((goal) => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          targetDate: goal.targetDate?.toISOString() || null,
          createdAt: goal.createdAt.toISOString(),
          updatedAt: goal.updatedAt.toISOString(),
          completedAt: goal.completedAt?.toISOString() || null,
          milestones: goal.milestones.map((milestone) => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            targetDate: milestone.targetDate?.toISOString() || null,
            completedAt: milestone.completedAt?.toISOString() || null,
          })),
        })),
      };
    }
  );

  // Create a new goal
  typedFastify.post(
    '/goals',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Create a new goal',
        tags: ['goals'],
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            targetDate: { type: ['string', 'null'] },
            milestones: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  targetDate: { type: ['string', 'null'] },
                },
              },
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              goal: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  status: { type: 'string' },
                  targetDate: { type: ['string', 'null'] },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
          400: { $ref: 'httpError' },
          401: { $ref: 'httpError' },
        },
      },
    },
    async function (request, reply) {
      const userId = request.user!.id;
      const { title, description, targetDate, milestones } = request.body as {
        title: string;
        description?: string | null;
        targetDate?: string | null;
        milestones?: Array<{
          title: string;
          description?: string | null;
          targetDate?: string | null;
        }>;
      };

      const goal = await fastify.prisma.goal.create({
        data: {
          userId,
          title,
          description: description || null,
          targetDate: targetDate ? new Date(targetDate) : null,
          milestones: milestones
            ? {
                create: milestones.map((m) => ({
                  title: m.title,
                  description: m.description || null,
                  targetDate: m.targetDate ? new Date(m.targetDate) : null,
                })),
              }
            : undefined,
        },
        include: {
          milestones: true,
        },
      });

      return {
        goal: {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          targetDate: goal.targetDate?.toISOString() || null,
          createdAt: goal.createdAt.toISOString(),
        },
      };
    }
  );

  // Update a goal
  typedFastify.put(
    '/goals/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Update a goal',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            targetDate: { type: ['string', 'null'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              goal: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  status: { type: 'string' },
                  targetDate: { type: ['string', 'null'] },
                  updatedAt: { type: 'string' },
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
      const goalId = Number((request.params as { id: string }).id);
      const { title, description, status, targetDate } = request.body as {
        title?: string;
        description?: string | null;
        status?: string;
        targetDate?: string | null;
      };

      // Verify goal belongs to user
      const existingGoal = await fastify.prisma.goal.findFirst({
        where: { id: goalId, userId },
      });

      if (!existingGoal) {
        return reply.notFound('Goal not found');
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) {
        updateData.status = status;
        if (status === 'COMPLETED' && existingGoal.status !== 'COMPLETED') {
          updateData.completedAt = new Date();
        }
      }
      if (targetDate !== undefined) {
        updateData.targetDate = targetDate ? new Date(targetDate) : null;
      }

      const goal = await fastify.prisma.goal.update({
        where: { id: goalId },
        data: updateData,
      });

      return {
        goal: {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          status: goal.status,
          targetDate: goal.targetDate?.toISOString() || null,
          updatedAt: goal.updatedAt.toISOString(),
        },
      };
    }
  );

  // Create a milestone
  typedFastify.post(
    '/goals/:goalId/milestones',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Create a milestone for a goal',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            goalId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            targetDate: { type: ['string', 'null'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              milestone: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  status: { type: 'string' },
                  targetDate: { type: ['string', 'null'] },
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
      const goalId = Number((request.params as { goalId: string }).goalId);
      if (isNaN(goalId)) {
        return reply.badRequest('Invalid goal ID');
      }
      const { title, description, targetDate } = request.body as {
        title: string;
        description?: string | null;
        targetDate?: string | null;
      };

      // Verify goal belongs to user
      const goal = await fastify.prisma.goal.findFirst({
        where: { id: goalId, userId },
      });

      if (!goal) {
        return reply.notFound('Goal not found');
      }

      const milestone = await fastify.prisma.milestone.create({
        data: {
          goalId,
          title,
          description: description || null,
          targetDate: targetDate ? new Date(targetDate) : null,
        },
      });

      return {
        milestone: {
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          status: milestone.status,
          targetDate: milestone.targetDate?.toISOString() || null,
        },
      };
    }
  );

  // Update a milestone
  typedFastify.put(
    '/milestones/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Update a milestone',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            targetDate: { type: ['string', 'null'] },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              milestone: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  description: { type: ['string', 'null'] },
                  status: { type: 'string' },
                  targetDate: { type: ['string', 'null'] },
                  completedAt: { type: ['string', 'null'] },
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
      const milestoneId = Number((request.params as { id: string }).id);
      if (isNaN(milestoneId)) {
        return reply.badRequest('Invalid milestone ID');
      }
      const { title, description, status, targetDate } = request.body as {
        title?: string;
        description?: string | null;
        status?: string;
        targetDate?: string | null;
      };

      // Verify milestone belongs to user's goal
      const existingMilestone = await fastify.prisma.milestone.findFirst({
        where: {
          id: milestoneId,
          goal: { userId },
        },
        include: { goal: true },
      });

      if (!existingMilestone) {
        return reply.notFound('Milestone not found');
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) {
        updateData.status = status;
        if (status === 'COMPLETED' && existingMilestone.status !== 'COMPLETED') {
          updateData.completedAt = new Date();
        }
      }
      if (targetDate !== undefined) {
        updateData.targetDate = targetDate ? new Date(targetDate) : null;
      }

      const milestone = await fastify.prisma.milestone.update({
        where: { id: milestoneId },
        data: updateData,
      });

      return {
        milestone: {
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          status: milestone.status,
          targetDate: milestone.targetDate?.toISOString() || null,
          completedAt: milestone.completedAt?.toISOString() || null,
        },
      };
    }
  );

  // Delete a goal
  typedFastify.delete(
    '/goals/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Delete a goal',
        tags: ['goals'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
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
      const goalId = Number((request.params as { id: string }).id);
      if (isNaN(goalId)) {
        return reply.badRequest('Invalid goal ID');
      }

      // Verify goal belongs to user
      const goal = await fastify.prisma.goal.findFirst({
        where: { id: goalId, userId },
      });

      if (!goal) {
        return reply.notFound('Goal not found');
      }

      await fastify.prisma.goal.delete({
        where: { id: goalId },
      });

      return { success: true };
    }
  );
};

export default goals;

