import { defineConfig } from '@prisma/cli';

export default defineConfig((_) => ({
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
}));
