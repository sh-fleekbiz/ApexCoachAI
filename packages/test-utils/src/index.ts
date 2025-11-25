import * as helper from 'fastify-cli/helper.js';
import * as path from 'node:path';
import process from 'node:process';
import type * as test from 'node:test';

export type TestContext = { after: typeof test.after };

/**
 * Common test environment configuration for ApexCoachAI backends
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

  return {
    config: async () => {
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
    },

    build: async (t: TestContext) => {
      const argv = [appPath];
      const app = await helper.build(
        argv,
        await createTestConfig(options).config()
      );

      t.after(() => void app.close());

      return app;
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

/**
 * Create test app builder for indexer backend
 */
export function createIndexerTestHelper(appPath?: string) {
  const defaultAppPath = path.join(process.cwd(), 'src', 'app.ts');
  return createTestConfig({
    appPath: appPath || defaultAppPath,
    azureOpenAiEmbeddingDeployment: 'text-embedding-3-small',
  });
}
