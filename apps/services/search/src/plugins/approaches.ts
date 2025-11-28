import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type {
  ChatApproach,
  ApproachContext,
  ApproachResponse,
  ApproachResponseChunk,
} from '../lib/approaches/approach.js';
import type { Message } from '../lib/message.js';
import { callResponsesApi } from '../lib/responses-api.js';

// Stub implementation using Responses API until full RAG approaches are integrated
class StubChatApproach implements ChatApproach {
  constructor(
    private readonly apiKey: string,
    private readonly responsesUrl: string,
    private readonly model: string
  ) {}

  async run(messages: Message[], context?: ApproachContext): Promise<ApproachResponse> {
    try {
      const chatContext = context as any;
      const previousResponseId = chatContext?.previousResponseId;

      const result = await callResponsesApi(
        messages,
        {
          previousResponseId,
          temperature: context?.temperature,
          maxOutputTokens: 2000,
        },
        this.apiKey,
        this.responsesUrl,
        this.model
      );

      return {
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: result.content,
              context: {
                data_points: {
                  text: [],
                },
                thoughts: 'Responses API implementation',
                responseId: result.responseId, // Store for next turn
              },
            },
          },
        ],
        object: 'chat.completion',
      };
    } catch (error) {
      // Fallback to stub response on error
      const lastUserMessage = messages.find((m) => m.role === 'user')?.content || 'Hello';
      return {
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. You said: "${lastUserMessage}"`,
              context: {
                data_points: {
                  text: [],
                },
                thoughts: 'Error in Responses API call',
              },
            },
          },
        ],
        object: 'chat.completion',
      };
    }
  }

  async *runWithStreaming(
    messages: Message[],
    _context?: ApproachContext,
  ): AsyncGenerator<ApproachResponseChunk, void> {
    const lastUserMessage = messages.find((m) => m.role === 'user')?.content || 'Hello';

    // Yield initial chunk
    yield {
      choices: [
        {
          index: 0,
          delta: {
            role: 'assistant',
            content: `This is a stub streaming response. Full RAG implementation pending. You said: "${lastUserMessage}"`,
            context: {
              data_points: {
                text: [],
              },
            },
          },
          finish_reason: 'none',
        },
      ],
      object: 'chat.completion.chunk',
    };

    // Yield final chunk
    yield {
      choices: [
        {
          index: 0,
          delta: {},
          finish_reason: 'stop',
        },
      ],
      object: 'chat.completion.chunk',
    };
  }
}

// Plugin to register RAG approaches
export default fp(
  async (fastify: FastifyInstance) => {
    const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
    const responsesUrl = process.env.AZURE_OPENAI_RESPONSES_URL || 
      'https://shared-openai-eastus2.cognitiveservices.azure.com/openai/v1/responses';
    const model = process.env.AI_MODEL_GENERAL || 'gpt-5.1-codex-mini';

    if (!apiKey) {
      fastify.log.warn('AZURE_OPENAI_API_KEY not set, Responses API will not work');
    }

    const stubApproach = new StubChatApproach(apiKey, responsesUrl, model);

    // Register approaches
    fastify.decorate('approaches', {
      chat: {
        rrr: stubApproach, // read-retrieve-read (default)
        rtr: stubApproach, // retrieve-then-read
      },
      ask: {
        rtr: stubApproach, // retrieve-then-read (default for Q&A)
      },
    });

    fastify.log.info('RAG approaches plugin loaded (Responses API implementation)');
  },
  {
    name: 'approaches',
    dependencies: ['config'],
  },
);

// Augment Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    approaches: {
      chat: Record<string, ChatApproach>;
      ask: Record<string, ChatApproach>;
    };
  }
}
