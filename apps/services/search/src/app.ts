import { type FastifyPluginAsync } from 'fastify';
import root from './routes/root.js';
import health from './routes/health.js';
import auth from './routes/auth.js';
import settings from './routes/settings.js';
import me from './routes/me.js';
import chatApi from './routes/chat-api.js';
import chats from './routes/chats.js';
import openapi from './plugins/openapi.js';
import config from './plugins/config.js';
import cors from './plugins/cors.js';
import prisma from './plugins/prisma.js';
import database from './plugins/database.js';
import authPlugin from './plugins/auth.js';
import sensible from './plugins/sensible.js';
import schemas from './plugins/schemas.js';
import approaches from './plugins/approaches.js';

export type AppOptions = {
  // Place your custom options for app below here.
};

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options_): Promise<void> => {
  // Place here your custom code!

  // Register core plugins first (order matters)
  await fastify.register(config);
  await fastify.register(cors);
  await fastify.register(prisma);
  await fastify.register(database);
  await fastify.register(authPlugin);
  await fastify.register(sensible); // Provides httpError schema
  await fastify.register(schemas); // Provides other schemas
  await fastify.register(approaches); // Provides chat approaches

  // Register OpenAPI/Swagger documentation
  await fastify.register(openapi);

  // Register routes
  await fastify.register(root);
  await fastify.register(health);
  await fastify.register(auth);
  await fastify.register(settings);
  await fastify.register(me);
  await fastify.register(chatApi);
  await fastify.register(chats);

  // Add /docs redirect to /openapi for consistency with other apps
  fastify.get('/docs', async (_request, reply) => {
    return reply.redirect('/openapi');
  });
};

export default app;
export { app, options };
