import { type FastifyPluginAsync } from 'fastify';
import { createRepositories } from '../db/index.js';

const me: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  const repos = createRepositories(fastify.prisma);
  // All routes in this plugin are protected by authentication
  fastify.addHook('preHandler', fastify.authenticate);

  // Export user data
  fastify.post('/me/export-data', async (request, reply) => {
    const user = await repos.user.getUserById(request.user.id);
    const chats = await repos.chat.getChatsForUser(request.user.id);
    const data = {
      user,
      chats,
    };
    reply.header('Content-Disposition', 'attachment; filename="export.json"');
    reply.send(data);
  });

  // Delete all chats
  fastify.post('/me/delete-all-chats', async (request, reply) => {
    try {
      await repos.chat.deleteAllChatsForUser(request.user.id);
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete all chats' });
    }
  });

  // Delete account
  fastify.post('/me/delete-account', async (request, reply) => {
    try {
      await repos.user.deleteUser(request.user.id);
      reply.clearCookie('token', { path: '/' });
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete account' });
    }
  });
};

export default me;
