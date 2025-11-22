import fp from 'fastify-plugin';
import { initializeDatabase, seedDefaultData } from '../db/database.js';

export default fp(async (_fastify, _options): Promise<void> => {
  // Initialize database schema
  initializeDatabase();

  // Seed default data
  seedDefaultData();
});
