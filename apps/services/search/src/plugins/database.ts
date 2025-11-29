import fp from 'fastify-plugin';
import { initializeDatabase, seedDefaultData } from '../db/database.js';

export default fp(async (fastify, _options): Promise<void> => {
  try {
    // Initialize database schema
    await initializeDatabase();

    // Seed default data
    await seedDefaultData();
    
    fastify.log.info('Database initialized successfully');
  } catch (error) {
    fastify.log.error({ error }, 'Failed to initialize database');
    // Don't throw - allow app to start even if DB init fails
  }
});
