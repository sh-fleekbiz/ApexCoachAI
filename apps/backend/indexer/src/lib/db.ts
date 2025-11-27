import { Pool, PoolClient, PoolConfig } from 'pg';

let pool: Pool | null = null;

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const config: PoolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  };

  return new Pool(config);
}

export function getPgPool(): Pool {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPgPool().connect();

  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
