import type { PrismaClient, User, Role } from '@prisma/client';

export interface CreateUserParameters {
  email: string;
  password_hash: string;
  name?: string;
  role?: Role;
  is_demo?: boolean;
  demo_role?: string;
  demo_label?: string;
}

export const createUserRepository = (prisma: PrismaClient) => ({
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async createUser(parameters: CreateUserParameters): Promise<User> {
    const {
      email,
      password_hash,
      name,
      role = 'USER',
      is_demo = false,
      demo_role,
      demo_label,
    } = parameters;
    return prisma.user.create({
      data: {
        email,
        passwordHash: password_hash,
        name: name ?? null,
        role,
        isDemo: is_demo,
        demoRole: demo_role ?? null,
        demoLabel: demo_label ?? null,
      },
    });
  },

  async getAllUsers(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateUserRole(id: number, role: Role): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { role },
    });
  },

  async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },

  async getDemoUsers(): Promise<User[]> {
    return prisma.user.findMany({
      where: { isDemo: true },
      orderBy: { demoRole: 'asc' },
    });
  },

  async getDemoUserByRole(demoRole: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        isDemo: true,
        demoRole,
      },
    });
  },
});
