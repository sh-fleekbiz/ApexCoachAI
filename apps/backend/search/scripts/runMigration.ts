import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const connectionString = process.env.SHARED_PG_CONNECTION_STRING;

  if (!connectionString) {
    console.error(
      '❌ SHARED_PG_CONNECTION_STRING environment variable is not set'
    );
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    const migrationPath = path.join(
      __dirname,
      '../migrations/001_add_demo_fields.sql'
    );
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Running migration...');
    await client.query(migrationSQL);
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
