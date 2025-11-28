import fp from 'fastify-plugin';
import { type AccessToken } from '@azure/core-http';

export type OpenAiService = {
  createEmbedding(input: string | string[]): Promise<Array<{ embedding: number[] }>>;
  getApiToken(): Promise<string>;
  config: {
    apiVersion: string;
    apiUrl: string;
  };
};

const AZURE_COGNITIVE_SERVICES_AD_SCOPE = 'https://cognitiveservices.azure.com/.default';

export default fp(
  async (fastify, _options) => {
    const config = fastify.config;
    const openAiUrl = `https://${config.azureOpenAiService}.cognitiveservices.azure.com`;
    const embeddingEndpoint = process.env.AZURE_OPENAI_EMBEDDING_ENDPOINT || 
      `${openAiUrl}/openai/deployments/${config.azureOpenAiEmbeddingDeployment}/embeddings?api-version=2023-05-15`;

    fastify.log.info(`Using OpenAI Embeddings at ${embeddingEndpoint}`);

    let openAiToken: AccessToken;

    const refreshOpenAiToken = async () => {
      if (!openAiToken || openAiToken.expiresOnTimestamp < Date.now() + 60 * 1000) {
        openAiToken = await fastify.azure.credential.getToken(AZURE_COGNITIVE_SERVICES_AD_SCOPE);
      }
    };

    fastify.decorate('openai', {
      async createEmbedding(input: string | string[]) {
        await refreshOpenAiToken();
        
        const response = await fetch(embeddingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': openAiToken.token,
          },
          body: JSON.stringify({
            input: Array.isArray(input) ? input : [input],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          fastify.log.error(`Embedding API error: ${response.status} - ${errorText}`);
          throw new Error(`Embedding generation failed: ${response.statusText}`);
        }

        const data = await response.json() as { data?: Array<{ embedding: number[] }> };
        return data.data || [];
      },
      async getApiToken() {
        await refreshOpenAiToken();
        return openAiToken.token;
      },
      config: {
        apiVersion: '2023-05-15',
        apiUrl: openAiUrl,
      },
    });
  },
  {
    name: 'openai',
    dependencies: ['azure', 'config'],
  },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    openai: OpenAiService;
  }
}
