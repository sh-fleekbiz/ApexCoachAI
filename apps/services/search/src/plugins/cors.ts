import cors from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp(
  async (fastify) => {
    const allowedOriginsString = fastify.config.allowedOrigins || '*';

    // Handle wildcard origin - for production, specify exact origins
    if (allowedOriginsString === '*') {
      fastify.log.info(`CORS allowed origins: * (all origins)`);
      fastify.register(cors, {
        origin: true, // Reflects the request origin in the response
        credentials: true,
      });
    } else {
      const allowedOrigins = allowedOriginsString
        .split(',')
        .map((origin) => origin.trim());
      fastify.log.info(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
      fastify.register(cors, {
        origin: allowedOrigins,
        credentials: true,
      });
    }
  },
  {
    name: 'cors',
    dependencies: ['config'],
  }
);
