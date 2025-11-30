import fp from 'fastify-plugin';
import { seedDefaultData } from '../db/seed.js';
import { seedComprehensiveData } from '../db/seed-comprehensive.js';

export default fp(async (fastify, _options): Promise<void> => {
  try {
    // Seed default data (schema is managed by Prisma migrations)
    await seedDefaultData(fastify.prisma);
    
    // Check if comprehensive data already exists
    const userCount = await fastify.prisma.user.count();
    const programCount = await fastify.prisma.program.count();
    
    // Only seed comprehensive data if database is mostly empty
    if (userCount < 5 || programCount < 3) {
      fastify.log.info('Seeding comprehensive data...');
      await seedComprehensiveData(fastify.prisma);
    } else {
      fastify.log.info('Database already has comprehensive data, skipping full seed');
    }
    
    fastify.log.info('Database seeded successfully');
  } catch (error) {
    fastify.log.error({ error }, 'Failed to seed database');
    // Don't throw - allow app to start even if seeding fails
  }
});
