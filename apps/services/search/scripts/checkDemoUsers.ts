import pg from 'pg';

async function checkDemoUsers() {
  const connectionString = process.env.SHARED_PG_CONNECTION_STRING;
  if (!connectionString) {
    console.error('SHARED_PG_CONNECTION_STRING not set');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT id, email, name, role, demo_role, demo_label FROM users WHERE is_demo = TRUE ORDER BY demo_role'
    );

    console.log('\n=== Demo Users in Database ===');
    if (result.rows.length === 0) {
      console.log('No demo users found!');
    } else {
      result.rows.forEach((user) => {
        console.log(
          `ID: ${user.id} | ${user.email} | ${user.name} (${user.role}) | ${user.demo_label}`
        );
      });
    }
    console.log('==============================\n');

    await client.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDemoUsers();
