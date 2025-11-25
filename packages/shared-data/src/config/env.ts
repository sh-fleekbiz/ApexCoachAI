import * as dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';

/**
 * Shared Azure service configuration interface
 * Used by both search and indexer backends
 */
export interface AzureConfig {
  azureStorageAccount: string;
  azureStorageContainer: string;
  azureSearchService: string;
  azureSearchIndex: string;
  azureSearchSemanticRanker: string;
  azureOpenAiService: string;
  azureOpenAiChatGptDeployment?: string; // Only used by search
  azureOpenAiChatGptModel?: string; // Only used by search
  azureOpenAiEmbeddingDeployment: string;
  azureOpenAiEmbeddingModel: string;
  kbFieldsContent: string;
  kbFieldsSourcePage: string;
  allowedOrigins?: string; // Only used by search
}

/**
 * Load environment variables from .env file
 * @param envPath - Path to .env file (defaults to ../../.env from current working directory)
 */
export function loadEnvironmentConfig(envPath?: string): void {
  const environmentPath = envPath || path.resolve(process.cwd(), '../../.env');
  console.log(`Loading .env config from ${environmentPath}...`);
  dotenv.config({ path: environmentPath });
}

/**
 * Convert camelCase to UPPER_SNAKE_CASE
 */
export function camelCaseToUpperSnakeCase(string_: string): string {
  return string_
    .replace(/[A-Z]/g, (letter: string) => `_${letter}`)
    .toUpperCase();
}

/**
 * Validate that all required configuration values are set
 * @param config - Configuration object to validate
 * @param skipValidation - Skip validation (useful for development)
 */
export function validateAzureConfig(
  config: Record<string, unknown>,
  skipValidation = false
): void {
  if (skipValidation) {
    return;
  }

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      const variableName = camelCaseToUpperSnakeCase(key).replace(
        'OPEN_AI',
        'OPENAI'
      );
      const message = `${variableName} environment variable must be set`;
      console.error(message);
      throw new Error(message);
    }
  }
}

/**
 * Create standardized Azure configuration for search backend
 */
export function createSearchAzureConfig(): AzureConfig {
  loadEnvironmentConfig();

  const config: AzureConfig = {
    azureStorageAccount: process.env.AZURE_STORAGE_ACCOUNT || '',
    azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER || '',
    azureSearchService: process.env.AZURE_SEARCH_SERVICE || '',
    azureSearchIndex: process.env.AZURE_SEARCH_INDEX || '',
    azureSearchSemanticRanker:
      process.env.AZURE_SEARCH_SEMANTIC_RANKER || 'disabled',
    azureOpenAiService: process.env.AZURE_OPENAI_SERVICE || '',
    // Standardized deployment names (shared across all portfolio apps)
    azureOpenAiChatGptDeployment:
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_CHATGPT_DEPLOYMENT ||
      '',
    azureOpenAiChatGptModel:
      process.env.AZURE_OPENAI_CHAT_DEPLOYMENT ||
      process.env.AZURE_OPENAI_CHATGPT_MODEL ||
      'gpt-5.1-mini',
    azureOpenAiEmbeddingDeployment:
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || '',
    azureOpenAiEmbeddingModel:
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT ||
      process.env.AZURE_OPENAI_EMBEDDING_MODEL ||
      'text-embedding-3-small',
    kbFieldsContent: process.env.KB_FIELDS_CONTENT || 'content',
    kbFieldsSourcePage: process.env.KB_FIELDS_SOURCEPAGE || 'sourcepage',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
  };

  // Skip Azure service validation for local development
  validateAzureConfig(
    config as unknown as Record<string, unknown>,
    process.env.NODE_ENV === 'development'
  );

  return config;
}

/**
 * Create standardized Azure configuration for indexer backend
 */
export function createIndexerAzureConfig(): AzureConfig {
  loadEnvironmentConfig();

  const config: AzureConfig = {
    azureStorageAccount: process.env.AZURE_STORAGE_ACCOUNT || '',
    azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER || '',
    azureSearchService: process.env.AZURE_SEARCH_SERVICE || '',
    azureSearchIndex: process.env.AZURE_SEARCH_INDEX || '',
    azureSearchSemanticRanker:
      process.env.AZURE_SEARCH_SEMANTIC_RANKER || 'disabled',
    azureOpenAiService: process.env.AZURE_OPENAI_SERVICE || '',
    azureOpenAiEmbeddingDeployment:
      process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || '',
    azureOpenAiEmbeddingModel:
      process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    kbFieldsContent: process.env.KB_FIELDS_CONTENT || 'content',
    kbFieldsSourcePage: process.env.KB_FIELDS_SOURCEPAGE || 'sourcepage',
  };

  validateAzureConfig(config as unknown as Record<string, unknown>);

  return config;
}
