// Stub implementation to avoid pg dependency issues

interface PoolClient {
  query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
  release: () => void;
}

interface Pool {
  connect: () => Promise<PoolClient>;
}

let pool: Pool | null = null;

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  // Return a stub pool instead of importing pg
  return {
    connect: async () => ({
      query: async () => ({ rows: [] }),
      release: () => {},
    }),
  };
}

export function getPgPool(): Pool {
  if (!pool) {
    pool = createPool();
  }

  return pool;
}

export async function withClient<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getPgPool().connect();

  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
