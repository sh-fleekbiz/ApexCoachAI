import Fastify, { type FastifyInstance } from 'fastify';

/**
 * Create test configuration for indexer
 */
export function createTestConfig() {
  return {
    NODE_ENV: 'test',
    AZURE_STORAGE_ACCOUNT: 'test-storage',
    AZURE_STORAGE_CONTAINER: 'test-container',
    AZURE_SEARCH_SERVICE: 'test-search',
    AZURE_SEARCH_INDEX: 'test-index',
    AZURE_SEARCH_SEMANTIC_RANKER: 'disabled',
    AZURE_OPENAI_SERVICE: 'test-openai',
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: 'text-embedding-3-small',
    AZURE_OPENAI_EMBEDDING_MODEL: 'text-embedding-3-small',
    KB_FIELDS_CONTENT: 'content',
    KB_FIELDS_SOURCEPAGE: 'sourcepage',
  };
}

/**
 * Create test helper for indexer backend
 */
export function createIndexerTestHelper(appPath: string) {
  const config = createTestConfig();

  async function build(): Promise<FastifyInstance> {
    const app = await import(appPath);
    const fastify = Fastify();

    // Decorate with test config
    fastify.decorate('config', config);

    // Register the app
    if (typeof app.default === 'function') {
      await fastify.register(app.default);
    }

    return fastify;
  }

  return { config, build };
}
