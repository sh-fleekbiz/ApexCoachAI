/**
 * PostgreSQL database connection pool for knowledge base operations.
 * Uses pg library with connection pooling for efficient database access.
 */

import pg from 'pg';

const { Pool, types } = pg;

// Parse numeric types as numbers instead of strings
types.setTypeParser(20, (val) => parseInt(val, 10)); // int8
types.setTypeParser(1700, (val) => parseFloat(val)); // numeric

interface PoolClient {
  query: (text: string, params?: any[]) => Promise<{ rows: any[]; rowCount: number | null }>;
  release: () => void;
}

let pool: pg.Pool | null = null;

function createPool(): pg.Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  return new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL !== 'false' ? { rejectUnauthorized: false } : undefined,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return error after 10 seconds if no connection
  });
}

export function getPgPool(): pg.Pool {
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
    return await fn(client as unknown as PoolClient);
  } finally {
    client.release();
  }
}

/**
 * Execute a query and return all rows
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  return withClient(async (client) => {
    const result = await client.query(sql, params);
    return result.rows as T[];
  });
}

/**
 * Execute a query and return the first row or null
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/**
 * Close the database pool (for graceful shutdown)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
