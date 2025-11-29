import { type FastifyPluginAsync } from 'fastify';
import root from './routes/root.js';
import health from './routes/health.js';
import openapi from './plugins/openapi.js';

export type AppOptions = {
  // Place your custom options for app below here.
};

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options_): Promise<void> => {
  // Place here your custom code!

  // Register OpenAPI/Swagger documentation
  await fastify.register(openapi);

  // Register basic routes manually
  await fastify.register(root);
  await fastify.register(health);

  // Add /docs redirect to /openapi for consistency with other apps
  fastify.get('/docs', async (_request, reply) => {
    return reply.redirect('/openapi');
  });
};

export default app;
export { app, options };
