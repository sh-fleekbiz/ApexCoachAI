import process from 'node:process';
import path from 'node:path';
import * as dotenv from 'dotenv';
import fp from 'fastify-plugin';

export interface AppConfig {
  azureStorageAccount: string;
  azureStorageContainer: string;
  azureSearchService: string;
  azureSearchIndex: string;
  azureSearchSemanticRanker: string;
  azureOpenAiService: string;
  azureOpenAiChatGptDeployment: string;
  azureOpenAiChatGptModel: string;
  azureOpenAiEmbeddingDeployment: string;
  azureOpenAiEmbeddingModel: string;
  kbFieldsContent: string;
  kbFieldsSourcePage: string;
  allowedOrigins: string;
}

const camelCaseToUpperSnakeCase = (string_: string) => string_.replaceAll(/[A-Z]/g, (l) => `_${l}`).toUpperCase();

export default fp(
  async (fastify, _options) => {
    const environmentPath = path.resolve(process.cwd(), '../../.env');

    console.log(`Loading .env config from ${environmentPath}...`);
    dotenv.config({ path: environmentPath });

    const config: AppConfig = {
      azureStorageAccount: process.env.AZURE_STORAGE_ACCOUNT || '',
      azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER || '',
      azureSearchService: process.env.AZURE_SEARCH_SERVICE || '',
      azureSearchIndex: process.env.AZURE_SEARCH_INDEX || '',
      azureSearchSemanticRanker: process.env.AZURE_SEARCH_SEMANTIC_RANKER || 'disabled',
      azureOpenAiService: process.env.AZURE_OPENAI_SERVICE || '',
      // Standardized deployment names (shared across all portfolio apps)
      azureOpenAiChatGptDeployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.AZURE_OPENAI_CHATGPT_DEPLOYMENT || '',
      azureOpenAiChatGptModel: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.AZURE_OPENAI_CHATGPT_MODEL || 'gpt-5.1-mini',
      azureOpenAiEmbeddingDeployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || '',
      azureOpenAiEmbeddingModel: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
      kbFieldsContent: process.env.KB_FIELDS_CONTENT || 'content',
      kbFieldsSourcePage: process.env.KB_FIELDS_SOURCEPAGE || 'sourcepage',
      allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
    };

    // Skip Azure service validation for local development
    if (process.env.NODE_ENV !== 'development') {
      // Check that all config values are set
      for (const [key, value] of Object.entries(config)) {
        if (!value) {
          const variableName = camelCaseToUpperSnakeCase(key).replace('OPEN_AI', 'OPENAI');
          const message = `${variableName} environment variable must be set`;
          fastify.log.error(message);
          throw new Error(message);
        }
      }
    }

    fastify.decorate('config', config);
  },
  { name: 'config' },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    config: AppConfig;
  }
}
