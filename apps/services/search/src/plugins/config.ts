import fp from 'fastify-plugin';
import { createSearchAzureConfig, type AzureConfig } from '../lib/config.js';

export interface AppConfig extends AzureConfig {
  enableDemoLogin: boolean;
}

export default fp(
  async (fastify, _options) => {
    const config = createSearchAzureConfig();
    const enableDemoLogin = process.env.ENABLE_DEMO_LOGIN === 'true';

    fastify.decorate('config', { ...config, enableDemoLogin });
  },
  { name: 'config' }
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    config: AppConfig;
  }
}
