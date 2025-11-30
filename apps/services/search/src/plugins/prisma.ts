import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export default fp(async (fastify, _options): Promise<void> => {
  // Prisma 7 requires an adapter for all databases
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create PostgreSQL adapter
  const adapter = new PrismaPg({ connectionString: databaseUrl });

  const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
  });

  // Make Prisma Client available through the fastify instance
  fastify.decorate('prisma', prisma);

  // Add hooks for graceful shutdown
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    prisma: PrismaClient;
  }
}
