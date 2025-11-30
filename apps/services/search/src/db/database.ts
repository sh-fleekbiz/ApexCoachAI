import { getPgPool, withClient } from '../lib/db.js';

// Export database pool for direct access if needed
export const database = getPgPool();

// Helper to execute queries with a client
export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  return withClient(async (client) => {
    const result = await client.query(sql, params);
    return result.rows as T[];
  });
}

// Helper for single row queries
export async function queryOne<T>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

// Initialize database schema
export async function initializeDatabase(): Promise<void> {
  await withClient(async (client) => {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK(role IN ('OWNER', 'ADMIN', 'COACH', 'USER')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_demo BOOLEAN DEFAULT FALSE,
        demo_role VARCHAR(50),
        demo_label TEXT
      );
    `);

    // Chats table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Chat messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('USER', 'ASSISTANT', 'SYSTEM')),
        content TEXT NOT NULL,
        citations_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
      );
    `);

    // Meta prompts (personalities) table
    await client.query(`
      CREATE TABLE IF NOT EXISTS meta_prompts (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        prompt_text TEXT NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Invitations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invitations (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK(role IN ('OWNER', 'ADMIN', 'COACH', 'USER')),
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED')),
        invited_by_user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP,
        FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Programs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by_user_id INTEGER NOT NULL,
        FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Program assignments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS program_assignments (
        id SERIAL PRIMARY KEY,
        program_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role VARCHAR(20) NOT NULL CHECK(role IN ('COACH', 'PARTICIPANT')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(program_id, user_id)
      );
    `);

    // Usage events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS usage_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        meta_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Library resources table
    await client.query(`
      CREATE TABLE IF NOT EXISTS library_resources (
        id SERIAL PRIMARY KEY,
        program_id INTEGER,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        source TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'indexed', 'failed')),
        duration_seconds INTEGER,
        transcript_json TEXT,
        speaker_meta_json TEXT,
        thumbnail_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
      );
    `);

    // User settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        default_personality_id INTEGER,
        nickname TEXT,
        occupation TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (default_personality_id) REFERENCES meta_prompts(id) ON DELETE SET NULL
      );
    `);

    // Admin action logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_action_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id INTEGER,
        description TEXT,
        meta_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // White label settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS white_label_settings (
        id SERIAL PRIMARY KEY,
        logo_url TEXT,
        brand_color TEXT,
        app_name TEXT,
        custom_css TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_is_demo_demo_role ON users(is_demo, demo_role) WHERE is_demo = TRUE;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_library_resources_program_id ON library_resources(program_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_library_resources_status ON library_resources(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_action_logs_user_id ON admin_action_logs(user_id);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_action_logs_action ON admin_action_logs(action);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_action_logs_created_at ON admin_action_logs(created_at DESC);
    `);

    console.log('Database initialized successfully');
  });
}

// Seed default meta prompt if none exists
export async function seedDefaultData(): Promise<void> {
  await withClient(async (client) => {
    // Seed default meta prompt
    const result = await client.query(
      'SELECT COUNT(*) as count FROM meta_prompts'
    );
    const metaPromptCount = parseInt(result.rows[0].count, 10);

    if (metaPromptCount === 0) {
      await client.query(
        `INSERT INTO meta_prompts (name, prompt_text, is_default)
         VALUES ($1, $2, $3)`,
        [
          'Tim – Inside Out Marriage Coach',
          `You are Tim, an empathetic and direct marriage coach specializing in the Inside Out Method from Apex Coach AI.

Your approach is:
- Empathetic yet direct, never sugar-coating issues
- Focused on personal accountability and emotional ownership
- Grounded in the principles of turning anger into calm leadership
- Committed to helping individuals rebuild connection and trust in their relationships

You speak with authority but compassion, asking tough questions that lead to breakthrough moments. You use language that resonates with men who are struggling but ready to change. You emphasize the importance of looking inward first before expecting external change.

Remember: Real transformation starts from the inside out.`,
          true,
        ]
      );

      console.log('Default meta prompt seeded');
    }

    // Seed demo users if they don't exist
    const demoUsersResult = await client.query(
      'SELECT COUNT(*) as count FROM users WHERE is_demo = TRUE'
    );
    const demoUserCount = parseInt(demoUsersResult.rows[0].count, 10);

    if (demoUserCount === 0) {
      const bcrypt = await import('bcryptjs');
      const demoUsers = [
        {
          email: 'demo.admin@apexcoachai.com',
          password: 'demo123',
          name: 'Alex Morgan',
          role: 'ADMIN',
          demo_role: 'admin',
          demo_label: 'Admin Demo - Full Platform Access',
        },
        {
          email: 'demo.coach@apexcoachai.com',
          password: 'demo123',
          name: 'Tim Johnson',
          role: 'COACH',
          demo_role: 'coach',
          demo_label: 'Coach Demo - Inside Out Method Expert',
        },
        {
          email: 'demo.client@apexcoachai.com',
          password: 'demo123',
          name: 'Michael Roberts',
          role: 'USER',
          demo_role: 'client',
          demo_label: 'Client Demo - Seeking Relationship Help',
        },
      ];

      for (const demoUser of demoUsers) {
        const passwordHash = await bcrypt.default.hash(demoUser.password, 10);
        await client.query(
          `INSERT INTO users (email, password_hash, name, role, is_demo, demo_role, demo_label)
           VALUES ($1, $2, $3, $4, TRUE, $5, $6)
           ON CONFLICT (email) DO NOTHING`,
          [
            demoUser.email,
            passwordHash,
            demoUser.name,
            demoUser.role,
            demoUser.demo_role,
            demoUser.demo_label,
          ]
        );
      }

      console.log('Demo users seeded');
    }
  });
}
