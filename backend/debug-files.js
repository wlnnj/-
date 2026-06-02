const { Client } = require('pg');
require('dotenv').config();

async function checkFiles() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'zky_cloud',
    });

    try {
        await client.connect();
        console.log('Connected to DB');

        const res = await client.query('SELECT id, file_name, file_path, mime_type, file_size, created_at FROM files ORDER BY created_at DESC LIMIT 5');
        console.log('Recent 5 files:');
        res.rows.forEach(file => {
            console.log('--------------------------------------------------');
            console.log(`ID: ${file.id}`);
            console.log(`Name: ${file.file_name}`);
            console.log(`Path: ${file.file_path}`);
            console.log(`MIME: ${file.mime_type}`);
            console.log(`Size: ${file.file_size}`);
            console.log(`Created: ${file.created_at}`);
        });

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkFiles();
