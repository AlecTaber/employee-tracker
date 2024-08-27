import { Client } from 'pg';

const client = new Client({
    user: 'your-username',
    host: 'localhost',
    database: 'your-database-name',
    password: 'your-password',
    port: 5432,
});

client.connect();
