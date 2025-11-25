import { createIndexerAzureConfig, type AzureConfig } from '@shared/data';
import fp from 'fastify-plugin';

export interface AppConfig extends AzureConfig {}

export default fp(
  async (fastify, _options) => {
    const config = createIndexerAzureConfig();
    fastify.decorate('config', config);
  },
  {
    name: 'config',
  }
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    config: AppConfig;
  }
}
