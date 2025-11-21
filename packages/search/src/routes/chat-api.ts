import { Readable } from 'node:stream';
import { type FastifyPluginAsync } from 'fastify';
import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type SchemaTypes } from '../plugins/schemas.js';
import { type ApproachContext } from '../lib/index.js';
import { chatRepository } from '../db/chat-repository.js';
import { messageRepository } from '../db/message-repository.js';
import { metaPromptRepository } from '../db/meta-prompt-repository.js';
import { userSettingsRepository } from '../db/user-settings-repository.js';
import { usageEventRepository } from '../db/usage-event-repository.js';
import type { Citation } from 'shared/chat-types.js';

const chatApi: FastifyPluginAsync = async (_fastify, _options): Promise<void> => {
  const fastify = _fastify.withTypeProvider<
    JsonSchemaToTsProvider<{
      ValidatorSchemaOptions: { references: SchemaTypes };
      SerializerSchemaOptions: { references: SchemaTypes };
    }>
  >();

  fastify.post('/api/chat', {
    preHandler: [fastify.authenticate],
    schema: {
      description: 'Chat with the bot (with persistence)',
      tags: ['chat'],
      body: {
        type: 'object',
        properties: {
          chatId: { type: ['number', 'null'] },
          input: { type: 'string' },
          personalityId: { type: ['number', 'null'] },
          context: {
            type: 'object',
            properties: {
              approach: { type: 'string' },
              retrieval_mode: { type: 'string', enum: ['hybrid', 'text', 'vectors'] },
              semantic_ranker: { type: 'boolean' },
              semantic_captions: { type: 'boolean' },
              top: { type: 'number' },
              temperature: { type: 'number' },
              exclude_category: { type: 'string' },
              prompt_template: { type: 'string' },
              prompt_template_prefix: { type: 'string' },
              prompt_template_suffix: { type: 'string' },
              suggest_followup_questions: { type: 'boolean' },
            },
            additionalProperties: { type: 'string' },
          },
          stream: { type: 'boolean' },
        },
        required: ['input'],
      },
      response: {
        400: { $ref: 'httpError' },
        401: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      const { chatId, input, personalityId, context, stream } = request.body as {
        chatId?: number | null;
        input: string;
        personalityId?: number | null;
        context?: any;
        stream?: boolean;
      };

      try {
        // Get or create chat
        let chat;
        if (chatId) {
          chat = chatRepository.getChatById(chatId);
          if (!chat || chat.user_id !== request.user!.id) {
            return reply.code(403).send({ error: 'Forbidden' });
          }
        } else {
          // Create new chat with title from first message
          const title = input.length > 50 ? input.slice(0, 50) + '...' : input;
          chat = chatRepository.createChat({
            user_id: request.user!.id,
            title,
          });
        }

        // Save user message
        messageRepository.createMessage({
          chat_id: chat.id,
          role: 'user',
          content: input,
        });

        // Log usage event
        usageEventRepository.createUsageEvent({
          user_id: request.user!.id,
          type: 'chat_message',
          meta_json: { chatId: chat.id, role: 'user' },
        });

        // Get personality/meta prompt
        let personalityPromptText = '';
        if (personalityId) {
          const personality = metaPromptRepository.getMetaPromptById(personalityId);
          if (personality) {
            personalityPromptText = personality.prompt_text;
          }
        } else {
          // Use default personality from user settings
          const settings = userSettingsRepository.getUserSettings(request.user!.id);
          if (settings?.default_personality_id) {
            const personality = metaPromptRepository.getMetaPromptById(settings.default_personality_id);
            if (personality) {
              personalityPromptText = personality.prompt_text;
            }
          } else {
            // Use global default
            const defaultPersonality = metaPromptRepository.getDefaultMetaPrompt();
            if (defaultPersonality) {
              personalityPromptText = defaultPersonality.prompt_text;
            }
          }
        }

        // Get recent messages for context (last 10 messages)
        const recentDatabaseMessages = messageRepository.getRecentMessages(chat.id, 10);

        // Build messages array with system prompt
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

        // Add system message with personality
        if (personalityPromptText) {
          messages.push({
            role: 'system',
            content: personalityPromptText,
          });
        }

        // Add recent conversation history (excluding the message we just saved)
        for (const message of recentDatabaseMessages) {
          if (message.role !== 'system') {
            messages.push({
              role: message.role as 'user' | 'assistant',
              content: message.content,
            });
          }
        }

        // Get the chat approach
        const { approach } = context ?? {};
        const chatApproach = fastify.approaches.chat[approach ?? 'rrr'];
        if (!chatApproach) {
          return reply.badRequest(`Chat approach "${approach}" is unknown or not implemented.`);
        }

        let approachContext: ApproachContext = (context as any) ?? {};
        if (this.config.azureSearchSemanticRanker !== 'enabled') {
          approachContext = { ...approachContext, semantic_ranker: false };
        }

        // Run RAG
        if (stream) {
          const buffer = new Readable();
          buffer._read = () => {};
          reply.type('application/x-ndjson').send(buffer);

          const chunks = await chatApproach.runWithStreaming(messages, approachContext);
          let fullResponse = '';
          let citations: Citation[] = [];

          for await (const chunk of chunks) {
            buffer.push(JSON.stringify(chunk) + '\n');

            // Accumulate response from delta (streaming chunks use delta, not message)
            if (chunk.choices?.[0]?.delta?.content) {
              fullResponse += chunk.choices[0].delta.content;
            }

            // Extract citations if present in delta context
            const dataPoints = chunk.choices?.[0]?.delta?.context?.data_points?.text;
            if (dataPoints && Array.isArray(dataPoints)) {
              // Store citations from the response
              citations = dataPoints.map((text: string, index: number) => ({
                id: `cite-${index}`,
                type: 'text' as const,
                sourceId: text,
                title: text,
                snippet: text,
              }));
            }
          }

          // Save assistant response
          if (fullResponse) {
            messageRepository.createMessage({
              chat_id: chat.id,
              role: 'assistant',
              content: fullResponse,
              citations: citations.length > 0 ? citations : undefined,
            });

            // Log usage event
            usageEventRepository.createUsageEvent({
              user_id: request.user!.id,
              type: 'chat_message',
              meta_json: { chatId: chat.id, role: 'assistant' },
            });
          }

          // Update chat timestamp
          chatRepository.updateChatTimestamp(chat.id);

          // Send final metadata
          buffer.push(JSON.stringify({ chatId: chat.id, done: true }) + '\n');
        } else {
          const response = await chatApproach.run(messages, approachContext);

          // Extract assistant response
          const assistantMessage = response.choices?.[0]?.message;
          if (assistantMessage) {
            // Parse citations from context
            const citations: Citation[] = [];
            if (assistantMessage.context?.data_points?.text) {
              for (const [index, text] of assistantMessage.context.data_points.text.entries()) {
                citations.push({
                  id: `cite-${index}`,
                  type: 'text',
                  sourceId: text,
                  title: text,
                  snippet: text,
                });
              }
            }

            // Save assistant response
            messageRepository.createMessage({
              chat_id: chat.id,
              role: 'assistant',
              content: assistantMessage.content,
              citations: citations.length > 0 ? citations : undefined,
            });

            // Log usage event
            usageEventRepository.createUsageEvent({
              user_id: request.user!.id,
              type: 'chat_message',
              meta_json: { chatId: chat.id, role: 'assistant' },
            });
          }

          // Update chat timestamp
          chatRepository.updateChatTimestamp(chat.id);

          return {
            ...response,
            chatId: chat.id,
          };
        }
      } catch (_error: unknown) {
        const error = _error as Error & { error?: any; status?: number };
        fastify.log.error(error);
        if (error.error) {
          return reply.code(error.status ?? 500).send(error);
        }

        return reply.internalServerError(error.message);
      }
    },
  });
};

export default chatApi;
