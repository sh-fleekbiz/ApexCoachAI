import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import type {
  ChatApproach,
  ApproachContext,
  ApproachResponse,
  ApproachResponseChunk,
} from '../lib/approaches/approach.js';
import type { Message } from '../lib/message.js';

// Stub implementation until full RAG approaches are integrated
class StubChatApproach implements ChatApproach {
  async run(messages: Message[], _context?: ApproachContext): Promise<ApproachResponse> {
    // Return a minimal response that matches the expected shape
    const lastUserMessage = messages.find((m) => m.role === 'user')?.content || 'Hello';

    return {
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `This is a stub response. Full RAG implementation pending. You said: "${lastUserMessage}"`,
            context: {
              data_points: {
                text: [],
              },
              thoughts: 'Stub implementation - RAG not yet configured',
            },
          },
        },
      ],
      object: 'chat.completion',
    };
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
    const stubApproach = new StubChatApproach();

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

    fastify.log.info('RAG approaches plugin loaded (stub implementation)');
  },
  {
    name: 'approaches',
    dependencies: [],
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
