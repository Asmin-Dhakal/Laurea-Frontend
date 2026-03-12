import mysql from 'mysql2/promise';

// Module-level singleton — reused across warm serverless invocations
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 5,
});

export default pool;
