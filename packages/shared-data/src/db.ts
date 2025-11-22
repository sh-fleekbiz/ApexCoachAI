import { Pool, PoolConfig } from "pg";

let pool: Pool | null = null;

function createPool(): Pool {
  const connectionString = process.env.SHARED_PG_CONNECTION_STRING;

  if (!connectionString) {
    throw new Error("SHARED_PG_CONNECTION_STRING is not set");
  }

  const config: PoolConfig = {
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000
  };

  return new Pool(config);
}

export function getPgPool(): Pool {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function withClient<T>(
  fn: (client: import("pg").PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPgPool().connect();

  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

