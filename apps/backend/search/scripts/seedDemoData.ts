import { withClient } from '@shared/data';

async function seedDemoData() {
  console.log('Starting realistic demo data seeding...');

  try {
    await withClient(async (client) => {
      // Get demo user IDs
      const usersResult = await client.query(
        'SELECT id, email, demo_role FROM users WHERE is_demo = TRUE'
      );
      const users = usersResult.rows.reduce((acc: any, user: any) => {
        acc[user.demo_role] = user.id;
        return acc;
      }, {});

      console.log('Found demo users:', users);

      // Seed programs for coach
      if (users.coach) {
        const programResult = await client.query(
          `INSERT INTO programs (name, description, created_by_user_id)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [
            'Inside Out Marriage Transformation',
            'A comprehensive 12-week program designed to help men transform their marriages from the inside out. Focus on emotional ownership, calm leadership, and rebuilding trust.',
            users.coach,
          ]
        );

        if (programResult.rows.length > 0) {
          const programId = programResult.rows[0].id;
          console.log(
            `✓ Created program: Inside Out Marriage Transformation (ID: ${programId})`
          );

          // Assign client to program
          if (users.client) {
            await client.query(
              `INSERT INTO program_assignments (program_id, user_id, role)
               VALUES ($1, $2, $3)
               ON CONFLICT DO NOTHING`,
              [programId, users.client, 'PARTICIPANT']
            );
            console.log(`  ✓ Assigned client to program`);
          }

          // Add library resources
          const resources = [
            {
              title: 'Understanding Emotional Triggers',
              type: 'video',
              source: 'https://example.com/video1',
              status: 'indexed',
              duration_seconds: 1245,
            },
            {
              title: 'The Art of Calm Leadership',
              type: 'video',
              source: 'https://example.com/video2',
              status: 'indexed',
              duration_seconds: 1580,
            },
            {
              title: 'Rebuilding Trust After Betrayal',
              type: 'video',
              source: 'https://example.com/video3',
              status: 'indexed',
              duration_seconds: 2100,
            },
          ];

          for (const resource of resources) {
            await client.query(
              `INSERT INTO library_resources (program_id, title, type, source, status, duration_seconds)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT DO NOTHING`,
              [
                programId,
                resource.title,
                resource.type,
                resource.source,
                resource.status,
                resource.duration_seconds,
              ]
            );
          }
          console.log(`  ✓ Added ${resources.length} library resources`);
        }
      }

      // Seed chats for client
      if (users.client) {
        const chatResult = await client.query(
          `INSERT INTO chats (user_id, title, created_at, updated_at)
           VALUES ($1, $2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days')
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [users.client, 'First Coaching Session - My Story']
        );

        if (chatResult.rows.length > 0) {
          const chatId = chatResult.rows[0].id;
          console.log(`✓ Created chat: First Coaching Session (ID: ${chatId})`);

          // Add sample messages
          const messages = [
            {
              role: 'USER',
              content:
                "I've been struggling in my marriage for years. My wife and I fight constantly, and I feel like she's always criticizing me. I don't know how to fix this.",
            },
            {
              role: 'ASSISTANT',
              content:
                "Thank you for sharing that, Michael. It takes courage to open up about these struggles. I hear you're feeling attacked and defensive in your marriage. Before we go deeper, I want you to understand something fundamental: real change in your marriage starts with you, not your wife. This isn't about blame - it's about power. You can't control her reactions, but you absolutely can control how you show up. Tell me, when she criticizes you, what's your typical response?",
            },
            {
              role: 'USER',
              content:
                "I usually get defensive or shut down. Sometimes I yell back. I know it doesn't help, but I feel like I'm being attacked.",
            },
            {
              role: 'ASSISTANT',
              content:
                "That's an honest answer. You're reacting from a place of feeling threatened, which is natural but not helpful. Here's the truth: your defensiveness is fuel on the fire. When you shut down or yell, you're handing your power away. Calm leadership means you stay present even when it's uncomfortable. It means you listen without defending, you own your part without making excuses. Can you think of a recent conflict where you could have responded differently?",
            },
          ];

          for (let i = 0; i < messages.length; i++) {
            await client.query(
              `INSERT INTO chat_messages (chat_id, role, content, created_at)
               VALUES ($1, $2, $3, NOW() - INTERVAL '${3 - i * 0.5} days')
               ON CONFLICT DO NOTHING`,
              [chatId, messages[i].role, messages[i].content]
            );
          }
          console.log(`  ✓ Added ${messages.length} chat messages`);
        }

        // Add second chat
        const chat2Result = await client.query(
          `INSERT INTO chats (user_id, title, created_at, updated_at)
           VALUES ($1, $2, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [users.client, 'Week 2 Check-in - Progress & Challenges']
        );

        if (chat2Result.rows.length > 0) {
          const chat2Id = chat2Result.rows[0].id;
          console.log(`✓ Created chat: Week 2 Check-in (ID: ${chat2Id})`);

          await client.query(
            `INSERT INTO chat_messages (chat_id, role, content, created_at)
             VALUES ($1, $2, $3, NOW() - INTERVAL '1 day')
             ON CONFLICT DO NOTHING`,
            [
              chat2Id,
              'USER',
              "I tried staying calm during an argument yesterday. It was really hard, but I didn't yell. She seemed surprised. What do I do next?",
            ]
          );
          console.log(`  ✓ Added follow-up message`);
        }
      }

      // Seed admin action logs for admin user
      if (users.admin) {
        await client.query(
          `INSERT INTO admin_action_logs (user_id, action, entity_type, entity_id, description, created_at)
           VALUES
             ($1, 'USER_INVITED', 'user', $2, 'Invited new coach to platform', NOW() - INTERVAL '5 days'),
             ($1, 'PROGRAM_CREATED', 'program', 1, 'Created new coaching program', NOW() - INTERVAL '4 days'),
             ($1, 'SETTINGS_UPDATED', 'settings', 1, 'Updated white label branding', NOW() - INTERVAL '2 days')
           ON CONFLICT DO NOTHING`,
          [users.admin, users.coach]
        );
        console.log(`✓ Added admin action logs`);
      }

      // Seed user settings
      for (const [role, userId] of Object.entries(users)) {
        await client.query(
          `INSERT INTO user_settings (user_id, nickname, occupation)
           VALUES ($1, $2, $3)
           ON CONFLICT (user_id) DO UPDATE SET
             nickname = EXCLUDED.nickname,
             occupation = EXCLUDED.occupation`,
          [
            userId,
            role === 'coach' ? 'Tim' : role === 'admin' ? 'Alex' : 'Mike',
            role === 'coach'
              ? 'Marriage Coach'
              : role === 'admin'
                ? 'Platform Admin'
                : 'Sales Manager',
          ]
        );
      }
      console.log(`✓ Added user settings for demo users`);
    });

    console.log('\n✓ Realistic demo data seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding demo data:', error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedDemoData };
