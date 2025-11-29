import { defineConfig } from '@prisma/cli';

export default defineConfig((_) => ({
  // Use `url` for the connection URL when Accelerate is not used.
  // `url` is required when using Accelerate.
  // `directUrl` is not required when using Accelerate.
  // If you are not using Accelerate, you can remove `directUrl` and uncomment `url`.
  // If you are using Accelerate, you must uncomment `accelerateUrl` and comment `url`.
  // For example:
  // url: env('DATABASE_URL'),
  // directUrl: env('DIRECT_URL'), // uncomment when you are not using Accelerate
  // accelerateUrl: env('PRISMA_ACCELERATE_URL'), // uncomment when you are using Accelerate
  
  // For this case, I will assume we are not using Accelerate and will keep directUrl logic.
  // However, the error suggests moving `url` or `directUrl` to a config file.
  // The error message specifically mentions: "Move connection URLs for Migrate to `prisma.config.ts` and pass either `adapter` for a direct database connection or `accelerateUrl` for Accelerate to the `PrismaClient` constructor."
  // Since the original schema had both `url` and `directUrl`, I'll assume `directUrl` is intended for the direct connection.
  // I will provide `directUrl` in the config.

  directUrl: process.env.DIRECT_URL,
}));
