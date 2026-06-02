require('dotenv').config();
const { Client } = require('pg');

const config = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
};

console.log('Trying to connect with config:', {
    ...config,
    password: '******' // hide password in log
});

const client = new Client(config);

client.connect()
    .then(() => {
        console.log('✅ Connection SUCCESS!');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('Database time:', res.rows[0]);
        return client.end();
    })
    .catch(err => {
        console.error('❌ Connection FAILED:', err.message);
        if (err.code) console.error('Error Code:', err.code);
        client.end();
    });
