import { type FastifyPluginAsync } from 'fastify';
import { chatRepository } from '../db/chat-repository.js';
import { messageRepository } from '../db/message-repository.js';

const chats: FastifyPluginAsync = async (fastify, _options): Promise<void> => {
  // Get all chats for the current user
  fastify.get('/chats', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Get all chats for the current user',
      tags: ['chats'],
      response: {
        200: {
          type: 'object',
          properties: {
            chats: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
      },
    },
    handler: async function (request, _reply) {
      const chats = await await chatRepository.getChatsByUserId(request.user!.id);

      return {
        chats: chats.map((chat) => ({
          id: chat.id,
          title: chat.title,
          createdAt: chat.created_at,
          updatedAt: chat.updated_at,
        })),
      };
    },
  });

  // Get messages for a specific chat
  fastify.get('/chats/:id/messages', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Get messages for a specific chat',
      tags: ['chats'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'assistant', 'system'] },
                  content: { type: 'string' },
                  citations: { type: 'array' },
                  createdAt: { type: 'string' },
                },
              },
            },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        404: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const chatId = (request.params as { id: number }).id;

      // Verify chat belongs to user
      const chat = await await chatRepository.getChatById(chatId);
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      if (chat.user_id !== request.user!.id) {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      const messages = await await messageRepository.getMessagesByChatId(chatId);

      return {
        messages: messages.map((message) => ({
          id: message.id.toString(),
          role: message.role,
          content: message.content,
          citations: message.citations_json ? JSON.parse(message.citations_json) : [],
          createdAt: message.created_at,
        })),
      };
    },
  });

  // Delete a chat
  fastify.delete('/chats/:id', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Delete a chat',
      tags: ['chats'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
        required: ['id'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        404: { $ref: 'httpError' },
      },
    },
    handler: async function (request, reply) {
      const chatId = (request.params as { id: number }).id;

      // Verify chat belongs to user
      const chat = await await chatRepository.getChatById(chatId);
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      if (chat.user_id !== request.user!.id) {
        return reply.code(403).send({ error: 'Forbidden' });
      }

      await chatRepository.deleteChat(chatId);

      return { message: 'Chat deleted successfully' };
    },
  });
};

export default chats;
