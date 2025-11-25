import fp from 'fastify-plugin';
import { createIndexerAzureConfig, type AzureConfig } from '../lib/config.js';

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
