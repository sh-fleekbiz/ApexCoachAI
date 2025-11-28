import { withClient } from '../lib/db.js';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: 'OWNER' | 'ADMIN' | 'COACH' | 'USER';
  created_at: string;
  is_demo: boolean;
  demo_role: string | null;
  demo_label: string | null;
}

export interface CreateUserParameters {
  email: string;
  password_hash: string;
  name?: string;
  role?: User['role'];
  is_demo?: boolean;
  demo_role?: string;
  demo_label?: string;
}

export const userRepository = {
  async getUserByEmail(email: string): Promise<User | null> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows.length > 0 ? (result.rows[0] as User) : null;
    });
  },

  async getUserById(id: number): Promise<User | null> {
    return withClient(async (client) => {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);
      return result.rows.length > 0 ? (result.rows[0] as User) : null;
    });
  },

  async createUser(parameters: CreateUserParameters): Promise<User> {
    return withClient(async (client) => {
      const {
        email,
        password_hash,
        name,
        role = 'USER',
        is_demo = false,
        demo_role,
        demo_label,
      } = parameters;
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, role, is_demo, demo_role, demo_label)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          email,
          password_hash,
          name ?? null,
          role,
          is_demo,
          demo_role ?? null,
          demo_label ?? null,
        ]
      );
      return result.rows[0] as User;
    });
  },

  async getAllUsers(): Promise<User[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM users ORDER BY created_at DESC'
      );
      return result.rows as User[];
    });
  },

  async updateUserRole(id: number, role: User['role']): Promise<void> {
    return withClient(async (client) => {
      await client.query('UPDATE users SET role = $1 WHERE id = $2', [
        role,
        id,
      ]);
    });
  },

  async deleteUser(id: number): Promise<void> {
    return withClient(async (client) => {
      await client.query('DELETE FROM users WHERE id = $1', [id]);
    });
  },

  async getDemoUsers(): Promise<User[]> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM users WHERE is_demo = TRUE ORDER BY demo_role'
      );
      return result.rows as User[];
    });
  },

  async getDemoUserByRole(demoRole: string): Promise<User | null> {
    return withClient(async (client) => {
      const result = await client.query(
        'SELECT * FROM users WHERE is_demo = TRUE AND demo_role = $1',
        [demoRole]
      );
      return result.rows.length > 0 ? (result.rows[0] as User) : null;
    });
  },
};
