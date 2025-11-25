import { withClient } from '@shared/data';
import bcrypt from 'bcryptjs';

interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'COACH' | 'USER';
  demo_role: string;
  demo_label: string;
}

const DEMO_USERS: DemoUser[] = [
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

async function seedDemoUsers() {
  console.log('Starting demo user seeding...');

  try {
    await withClient(async (client) => {
      for (const demoUser of DEMO_USERS) {
        const passwordHash = await bcrypt.hash(demoUser.password, 10);

        // Use INSERT ... ON CONFLICT for idempotency
        const result = await client.query(
          `INSERT INTO users (email, password_hash, name, role, is_demo, demo_role, demo_label)
           VALUES ($1, $2, $3, $4, TRUE, $5, $6)
           ON CONFLICT (email)
           DO UPDATE SET
             name = EXCLUDED.name,
             role = EXCLUDED.role,
             is_demo = EXCLUDED.is_demo,
             demo_role = EXCLUDED.demo_role,
             demo_label = EXCLUDED.demo_label
           RETURNING id, email, name, role, demo_role`,
          [
            demoUser.email,
            passwordHash,
            demoUser.name,
            demoUser.role,
            demoUser.demo_role,
            demoUser.demo_label,
          ]
        );

        console.log(
          `✓ Seeded demo user: ${result.rows[0].email} (${result.rows[0].demo_role}) - ID: ${result.rows[0].id}`
        );
      }

      // Verify demo users
      const verifyResult = await client.query(
        'SELECT id, email, name, role, demo_role, demo_label FROM users WHERE is_demo = TRUE ORDER BY demo_role'
      );

      console.log('\n=== Demo Users Summary ===');
      verifyResult.rows.forEach((user) => {
        console.log(
          `ID: ${user.id} | ${user.email} | ${user.name} (${user.role}) | ${user.demo_label}`
        );
      });
      console.log('=========================\n');
    });

    console.log('✓ Demo user seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding demo users:', error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDemoUsers };
