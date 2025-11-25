import { type FastifyPluginAsync } from 'fastify';
import { userRepository } from '../db/user-repository.js';
import { chatRepository } from '../db/chat-repository.js';

const me: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  // All routes in this plugin are protected by authentication
  fastify.addHook('preHandler', fastify.authenticate);

  // Export user data
  fastify.post('/me/export-data', async (request, reply) => {
    const user = await await userRepository.getUserById(request.user.id);
    const chats = await await chatRepository.getChatsForUser(request.user.id);
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
      await await chatRepository.deleteAllChatsForUser(request.user.id);
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete all chats' });
    }
  });

  // Delete account
  fastify.post('/me/delete-account', async (request, reply) => {
    try {
      await await userRepository.deleteUser(request.user.id);
      reply.clearCookie('token', { path: '/' });
      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to delete account' });
    }
  });
};

export default me;
