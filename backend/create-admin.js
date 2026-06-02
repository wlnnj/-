const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'ZKY520',
        database: 'zky_cloud',
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const passwordHash = await bcrypt.hash('ZHANGkeyan1314520', 10);
        console.log('Password hashed');

        const result = await client.query(`
            INSERT INTO users (id, username, password_hash, role, accent_color, is_locked, failed_login_attempts, created_at, updated_at)
            VALUES (gen_random_uuid(), $1, $2, 'admin', 'cyber-blue', false, 0, NOW(), NOW())
            ON CONFLICT (username) DO UPDATE SET password_hash = $2, role = 'admin'
            RETURNING id, username, role
        `, ['wezky', passwordHash]);

        console.log('Admin user created/updated:', result.rows[0]);
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

createAdmin();
