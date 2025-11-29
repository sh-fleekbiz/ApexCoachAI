import { type FastifyPluginAsync } from 'fastify';
import root from './routes/root.js';
import health from './routes/health.js';

export type AppOptions = {
  // Place your custom options for app below here.
};

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify, options_): Promise<void> => {
  // Place here your custom code!

  // Register basic routes manually
  await fastify.register(root);
  await fastify.register(health);
};

export default app;
export { app, options };
