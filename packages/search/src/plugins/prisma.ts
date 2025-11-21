import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

export default fp(async (fastify, _options): Promise<void> => {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
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
