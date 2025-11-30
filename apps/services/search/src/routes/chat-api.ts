import { type JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { type FastifyPluginAsync } from 'fastify';
import { Readable } from 'node:stream';
import { type ApproachContext } from '../lib/index.js';
import { type SchemaTypes } from '../plugins/schemas.js';
import { chatService } from '../services/chat-service.js';
import type { Citation } from '../types/chat-types.js';

// In-memory store for previous_response_id per chat (for stateful conversations)
// Note: Database persistence could be considered for future scalability
const chatResponseIds = new Map<number, string>();

const chatApi: FastifyPluginAsync = async (
  _fastify,
  _options
): Promise<void> => {
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
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                content: { type: 'string' },
              },
            },
          },
          personalityId: { type: ['number', 'null'] },
          context: {
            type: 'object',
            properties: {
              approach: { type: 'string' },
              retrieval_mode: {
                type: 'string',
                enum: ['hybrid', 'text', 'vectors'],
              },
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
        // Accept either 'input' or 'messages' (for backward compatibility)
        anyOf: [
          { required: ['input'] },
          { required: ['messages'] },
        ],
      },
      response: {
        400: { $ref: 'httpError' },
        401: { $ref: 'httpError' },
        403: { $ref: 'httpError' },
        500: { $ref: 'httpError' },
      },
    } as const,
    handler: async function (request, reply) {
      const { chatId, input, messages, personalityId, context, stream } =
        request.body as {
          chatId?: number | null;
          input?: string;
          messages?: Array<{ role: string; content: string }>;
          personalityId?: number | null;
          context?: any;
          stream?: boolean;
        };

      // Extract input from messages array if input is not provided
      let userInput = input;
      if (!userInput && messages && messages.length > 0) {
        // Get the last user message from the messages array
        const lastUserMessage = messages
          .slice()
          .reverse()
          .find((msg) => msg.role === 'user');
        userInput = lastUserMessage?.content || '';
      }

      if (!userInput) {
        return reply.badRequest('Either "input" or "messages" with at least one user message is required');
      }

      try {
        const result = await chatService.prepareChatContext({
          chatId,
          userId: request.user!.id,
          input: userInput,
          personalityId,
        });

        if (!result) {
          return reply.internalServerError('Failed to prepare chat context');
        }

        const { chat, messages: chatMessages } = result;

        const { approach } = context ?? {};
        const chatApproach = fastify.approaches.chat[approach ?? 'rrr'];
        if (!chatApproach) {
          return reply.badRequest(
            `Chat approach "${approach}" is unknown or not implemented.`
          );
        }

        const previousResponseId = chatResponseIds.get(chat.id);

        const approachContext: ApproachContext = {
          ...(context as any),
          previousResponseId,
        };

        if (stream) {
          const buffer = new Readable();
          buffer._read = () => {};
          reply.type('application/x-ndjson').send(buffer);

          const chunks = await chatApproach.runWithStreaming(
            chatMessages,
            approachContext
          );
          let fullResponse = '';
          let citations: Citation[] = [];

          for await (const chunk of chunks) {
            buffer.push(JSON.stringify(chunk) + '\n');

            if (chunk.choices?.[0]?.delta?.content) {
              fullResponse += chunk.choices[0].delta.content;
            }

            const dataPoints =
              chunk.choices?.[0]?.delta?.context?.data_points?.text;
            if (dataPoints && Array.isArray(dataPoints)) {
              citations = dataPoints.map((text: string, index: number) => ({
                id: `cite-${index}`,
                type: 'text' as const,
                sourceId: text,
                title: text,
                snippet: text,
              }));
            }
          }

          await chatService.saveAssistantMessageAndLogUsage({
            chatId: chat.id,
            userId: request.user!.id,
            content: fullResponse,
            citations,
          });

          buffer.push(JSON.stringify({ chatId: chat.id, done: true }) + '\n');
        } else {
          const response = await chatApproach.run(chatMessages, approachContext);

          const assistantMessage = response.choices?.[0]?.message;
          if (assistantMessage) {
            if (assistantMessage.context?.responseId) {
              chatResponseIds.set(
                chat.id,
                assistantMessage.context.responseId as string
              );
            }

            const citations: Citation[] = [];
            if (assistantMessage.context?.data_points?.text) {
              for (const [
                index,
                text,
              ] of assistantMessage.context.data_points.text.entries()) {
                citations.push({
                  id: `cite-${index}`,
                  type: 'text',
                  sourceId: text,
                  title: text,
                  snippet: text,
                });
              }
            }

            await chatService.saveAssistantMessageAndLogUsage({
              chatId: chat.id,
              userId: request.user!.id,
              content: assistantMessage.content,
              citations,
            });
          }

          return {
            ...response,
            chatId: chat.id,
          };
        }
      } catch (_error: unknown) {
        const error = _error as Error & { error?: any; status?: number };
        fastify.log.error(error);
        if (error.error) {
          // @ts-expect-error: Dynamic status code handling
          return reply.code(error.status ?? 500).send(error);
        }

        return reply.internalServerError(error.message);
      }
    },
  });
};

export default chatApi;
