import * as dotenv from 'dotenv';
import path from 'node:path';
import process from 'node:process';

/**
 * Azure service configuration interface for indexer
 */
export interface AzureConfig {
  azureStorageAccount: string;
  azureStorageContainer: string;
  azureSearchService: string;
  azureSearchIndex: string;
  azureSearchSemanticRanker: string;
  azureOpenAiService: string;
  azureOpenAiEmbeddingDeployment: string;
  azureOpenAiEmbeddingModel: string;
  kbFieldsContent: string;
  kbFieldsSourcePage: string;
}

/**
 * Load environment variables from .env file
 */
function loadEnvironmentConfig(envPath?: string): void {
  const environmentPath = envPath || path.resolve(process.cwd(), '../../.env');
  console.log(`Loading .env config from ${environmentPath}...`);
  dotenv.config({ path: environmentPath });
}

/**
 * Convert camelCase to UPPER_SNAKE_CASE
 */
function camelCaseToUpperSnakeCase(string_: string): string {
  return string_
    .replace(/[A-Z]/g, (letter: string) => `_${letter}`)
    .toUpperCase();
}

/**
 * Validate that all required configuration values are set
 */
function validateAzureConfig(
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
