import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path - store in data directory at project root
const databasePath = process.env.DATABASE_PATH || path.join(__dirname, '../../../../data/app.db');

export const database = new Database(databasePath);

// Enable foreign keys
database.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'coach', 'user')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Chats table
  database.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Chat messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chat_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      citations_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    );
  `);

  // Meta prompts (personalities) table
  database.exec(`
    CREATE TABLE IF NOT EXISTS meta_prompts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      prompt_text TEXT NOT NULL,
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Invitations table
  database.exec(`
    CREATE TABLE IF NOT EXISTS invitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'coach', 'user')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired', 'cancelled')),
      invited_by_user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accepted_at DATETIME,
      FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Programs table
  database.exec(`
    CREATE TABLE IF NOT EXISTS programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by_user_id INTEGER NOT NULL,
      FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Program assignments table
  database.exec(`
    CREATE TABLE IF NOT EXISTS program_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('coach', 'participant')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Usage events table
  database.exec(`
    CREATE TABLE IF NOT EXISTS usage_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      meta_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Library resources table
  database.exec(`
    CREATE TABLE IF NOT EXISTS library_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_id INTEGER,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
    );
  `);

  // User settings table
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER PRIMARY KEY,
      default_personality_id INTEGER,
      nickname TEXT,
      occupation TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (default_personality_id) REFERENCES meta_prompts(id) ON DELETE SET NULL
    );
  `);

  // Create indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
    CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  console.log('Database initialized successfully');
}

// Seed default meta prompt if none exists
export function seedDefaultData() {
  const metaPromptCount = database.prepare('SELECT COUNT(*) as count FROM meta_prompts').get() as { count: number };

  if (metaPromptCount.count === 0) {
    database
      .prepare(
        `
      INSERT INTO meta_prompts (name, prompt_text, is_default)
      VALUES (?, ?, ?)
    `,
      )
      .run(
        'Tim – Inside Out Marriage Coach',
        `You are Tim, an empathetic and direct marriage coach specializing in the Inside Out Method from Apex Coach AI. 

Your approach is:
- Empathetic yet direct, never sugar-coating issues
- Focused on personal accountability and emotional ownership
- Grounded in the principles of turning anger into calm leadership
- Committed to helping individuals rebuild connection and trust in their relationships

You speak with authority but compassion, asking tough questions that lead to breakthrough moments. You use language that resonates with men who are struggling but ready to change. You emphasize the importance of looking inward first before expecting external change.

Remember: Real transformation starts from the inside out.`,
        1,
      );

    console.log('Default meta prompt seeded');
  }
}
