import Fastify, { type FastifyInstance } from 'fastify';
import * as path from 'node:path';
import process from 'node:process';
import type * as test from 'node:test';

export type TestContext = { after: typeof test.after };

/**
 * Common test environment configuration
 * Sets up mock Azure service environment variables for testing
 */
export function createTestConfig(
  options: {
    appPath: string;
    azureOpenAiService?: string;
    azureSearchService?: string;
    azureSearchIndex?: string;
    azureStorageAccount?: string;
    azureStorageContainer?: string;
    azureOpenAiChatGptDeployment?: string;
    azureOpenAiChatGptModel?: string;
    azureOpenAiEmbeddingDeployment?: string;
    azureOpenAiEmbeddingModel?: string;
  } = { appPath: '' }
) {
  const {
    appPath,
    azureOpenAiService = 'https://test-openai.openai.azure.com/',
    azureSearchService = 'https://test-search.search.windows.net/',
    azureSearchIndex = 'test-index',
    azureStorageAccount = 'teststorage',
    azureStorageContainer = 'test-container',
    azureOpenAiChatGptDeployment = 'gpt-4o-mini',
    azureOpenAiChatGptModel = 'gpt-4o-mini',
    azureOpenAiEmbeddingDeployment = 'text-embedding-3-small',
    azureOpenAiEmbeddingModel = 'text-embedding-3-small',
  } = options;

  const applyEnvConfig = async () => {
      // Set test environment variables
      process.env.AZURE_OPENAI_SERVICE = azureOpenAiService;
      process.env.AZURE_SEARCH_SERVICE = azureSearchService;
      process.env.AZURE_SEARCH_INDEX = azureSearchIndex;
      process.env.AZURE_STORAGE_ACCOUNT = azureStorageAccount;
      process.env.AZURE_STORAGE_CONTAINER = azureStorageContainer;
      process.env.AZURE_OPENAI_CHATGPT_DEPLOYMENT =
        azureOpenAiChatGptDeployment;
      process.env.AZURE_OPENAI_CHATGPT_MODEL = azureOpenAiChatGptModel;
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT =
        azureOpenAiEmbeddingDeployment;
      process.env.AZURE_OPENAI_EMBEDDING_MODEL = azureOpenAiEmbeddingModel;
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT = azureOpenAiChatGptDeployment;
      process.env.AZURE_OPENAI_API_KEY = 'test-key';
      process.env.AZURE_OPENAI_API_VERSION = '2024-02-15-preview';
      process.env.NODE_ENV = 'test';

      return {};
  };

  return {
    config: applyEnvConfig,

    build: async (t: TestContext): Promise<FastifyInstance> => {
      await applyEnvConfig();

      const appModule = await import(appPath);
      const fastify = Fastify();

      if (typeof appModule.default === 'function') {
        await fastify.register(appModule.default);
      }

      t.after(() => void fastify.close());

      return fastify;
    },
  };
}

/**
 * Create test app builder for search backend
 */
export function createSearchTestHelper(appPath?: string) {
  const defaultAppPath = path.join(process.cwd(), 'src', 'app.ts');
  return createTestConfig({
    appPath: appPath || defaultAppPath,
    azureOpenAiChatGptDeployment: 'gpt-4o-mini',
    azureOpenAiChatGptModel: 'gpt-4o-mini',
    azureOpenAiEmbeddingDeployment: 'text-embedding-3-small',
  });
}
