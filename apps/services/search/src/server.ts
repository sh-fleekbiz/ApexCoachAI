import { fastify } from 'fastify';
import app from './app.js';

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register the app plugin which loads all other plugins and routes
server.log.info('Registering app plugin...');
await server.register(app);
server.log.info('App plugin registered successfully');

// Add a catch-all 404 handler
server.setNotFoundHandler((request, reply) => {
  server.log.warn(`Route not found: ${request.method} ${request.url}`);
  reply.code(404).send({
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Start the server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    server.log.info(`Starting server on ${host}:${port}...`);
    await server.listen({ port, host });
    server.log.info(`Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Call the start function
start();
