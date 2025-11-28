import { type FastifyPluginAsync } from 'fastify';

const health: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            service: { type: 'string' },
            version: { type: 'string' },
          },
        },
      },
    },
    handler: async function (_request, reply) {
      return reply.code(200).send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'apexcoachai-indexer',
        version: '1.0.0',
      });
    },
  });
};

export default health;
