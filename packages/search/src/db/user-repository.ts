import { database } from './database.js';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: 'owner' | 'admin' | 'coach' | 'user';
  created_at: string;
}

export interface CreateUserParameters {
  email: string;
  password_hash: string;
  name?: string;
}

export const userRepository = {
  getUserByEmail(email: string): User | undefined {
    return database.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
  },

  getUserById(id: number): User | undefined {
    return database.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  },

  createUser(parameters: CreateUserParameters): User {
    const { email, password_hash, name } = parameters;
    const result = database
      .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
      .run(email, password_hash, name ?? undefined);

    return this.getUserById(result.lastInsertRowid as number)!;
  },

  getAllUsers(): User[] {
    return database.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  },

  updateUserRole(id: number, role: User['role']) {
    const stmt = database.prepare('UPDATE users SET role = ? WHERE id = ?');
    stmt.run(role, id);
  },

  deleteUser(id: number) {
    const stmt = database.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
  },
};
