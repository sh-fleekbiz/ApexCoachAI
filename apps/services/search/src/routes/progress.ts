import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';

const progress: FastifyPluginAsync = async (fastify): Promise<void> => {
  const typedFastify = fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  // Get progress tracking data
  typedFastify.get(
    '/progress',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get progress tracking data for the current user',
        tags: ['progress'],
        response: {
          200: {
            type: 'object',
            properties: {
              progress: {
                type: 'object',
                properties: {
                  totalChats: { type: 'number' },
                  totalMessages: { type: 'number' },
                  activeGoals: { type: 'number' },
                  completedGoals: { type: 'number' },
                  completedMilestones: { type: 'number' },
                  topicsCovered: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  learningPath: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        topic: { type: 'string' },
                        progress: { type: 'number' },
                        recommended: { type: 'boolean' },
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

      const [chats, goals, sessionSummaries] = await Promise.all([
        fastify.prisma.chat.findMany({
          where: { userId },
          include: { messages: true },
        }),
        fastify.prisma.goal.findMany({
          where: { userId },
          include: { milestones: true },
        }),
        fastify.prisma.sessionSummary.findMany({
          where: { userId },
        }),
      ]);

      const totalChats = chats.length;
      const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);
      const activeGoals = goals.filter((g) => g.status === 'ACTIVE').length;
      const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;
      const completedMilestones = goals.reduce(
        (sum, goal) => sum + goal.milestones.filter((m) => m.status === 'COMPLETED').length,
        0
      );

      // Extract topics from session summaries
      const topicsSet = new Set<string>();
      sessionSummaries.forEach((summary) => {
        summary.topics.forEach((topic) => topicsSet.add(topic));
      });

      const topicsCovered = Array.from(topicsSet);

      // Generate learning path recommendations
      const learningPath = [
        { topic: 'Communication Skills', progress: 0, recommended: true },
        { topic: 'Relationship Building', progress: 0, recommended: true },
        { topic: 'Goal Achievement', progress: 0, recommended: false },
        { topic: 'Habit Formation', progress: 0, recommended: false },
      ].map((path) => {
        const hasTopic = topicsCovered.includes(path.topic);
        return {
          ...path,
          progress: hasTopic ? 50 : 0,
          recommended: !hasTopic,
        };
      });

      return {
        progress: {
          totalChats,
          totalMessages,
          activeGoals,
          completedGoals,
          completedMilestones,
          topicsCovered,
          learningPath,
        },
      };
    }
  );
};

export default progress;

