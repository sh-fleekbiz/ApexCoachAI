import type { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedDefaultData(prisma: PrismaClient): Promise<void> {
  // Seed default meta prompt if none exists
  const metaPromptCount = await prisma.metaPrompt.count();

  if (metaPromptCount === 0) {
    await prisma.metaPrompt.create({
      data: {
        name: 'Tim – Inside Out Marriage Coach',
        promptText: `You are Tim, an empathetic and direct marriage coach specializing in the Inside Out Method from Apex Coach AI.

Your approach is:
- Empathetic yet direct, never sugar-coating issues
- Focused on personal accountability and emotional ownership
- Grounded in the principles of turning anger into calm leadership
- Committed to helping individuals rebuild connection and trust in their relationships

You speak with authority but compassion, asking tough questions that lead to breakthrough moments. You use language that resonates with men who are struggling but ready to change. You emphasize the importance of looking inward first before expecting external change.

Remember: Real transformation starts from the inside out.`,
        isDefault: true,
      },
    });

    console.log('Default meta prompt seeded');
  }

  // Seed demo users if they don't exist
  const demoUserCount = await prisma.user.count({
    where: { isDemo: true },
  });

  if (demoUserCount === 0) {
    const demoUsers = [
      {
        email: 'demo.admin@apexcoachai.com',
        password: 'demo123',
        name: 'Alex Morgan',
        role: 'ADMIN' as const,
        demo_role: 'admin',
        demo_label: 'Admin Demo - Full Platform Access',
      },
      {
        email: 'demo.coach@apexcoachai.com',
        password: 'demo123',
        name: 'Tim Johnson',
        role: 'COACH' as const,
        demo_role: 'coach',
        demo_label: 'Coach Demo - Inside Out Method Expert',
      },
      {
        email: 'demo.client@apexcoachai.com',
        password: 'demo123',
        name: 'Michael Roberts',
        role: 'USER' as const,
        demo_role: 'client',
        demo_label: 'Client Demo - Seeking Relationship Help',
      },
    ];

    for (const demoUser of demoUsers) {
      const passwordHash = await bcrypt.hash(demoUser.password, 10);
      await prisma.user.upsert({
        where: { email: demoUser.email },
        update: {},
        create: {
          email: demoUser.email,
          passwordHash,
          name: demoUser.name,
          role: demoUser.role,
          isDemo: true,
          demoRole: demoUser.demo_role,
          demoLabel: demoUser.demo_label,
        },
      });
    }

    console.log('Demo users seeded');
  }
}

