import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

// If your network requires SSL and you don't want strict cert verification:
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }
});

export default sql;