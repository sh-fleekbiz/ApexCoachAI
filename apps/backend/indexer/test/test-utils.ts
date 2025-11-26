import Fastify, { type FastifyInstance } from 'fastify';
import type { AppConfig } from '../src/plugins/config.js';

/**
 * Create test configuration for indexer
 */
export function createTestConfig(): AppConfig {
  return {
    azureStorageAccount: 'test-storage',
    azureStorageContainer: 'test-container',
    azureSearchService: 'test-search',
    azureSearchIndex: 'test-index',
    azureSearchSemanticRanker: 'disabled',
    azureOpenAiService: 'test-openai',
    azureOpenAiEmbeddingDeployment: 'text-embedding-3-small',
    azureOpenAiEmbeddingModel: 'text-embedding-3-small',
    kbFieldsContent: 'content',
    kbFieldsSourcePage: 'sourcepage',
  };
}

/**
 * Create test helper for indexer backend
 */
export function createIndexerTestHelper(appPath: string) {
  const config = createTestConfig();

  async function build(
    t?: { after: (fn: () => void | Promise<void>) => void }
  ): Promise<FastifyInstance> {
    const app = await import(appPath);
    const fastify = Fastify();

    // Decorate with test config
    fastify.decorate('config', config);

    // Register the app
    if (typeof app.default === 'function') {
      await fastify.register(app.default);
    }

    if (t) {
      t.after(async () => {
        await fastify.close();
      });
    }

    return fastify;
  }

  return { config, build };
}
