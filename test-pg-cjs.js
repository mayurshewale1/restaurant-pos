// CommonJS test for Postgres using `pg` (works without ESM)
// Usage (PowerShell):
// $env:DATABASE_URL="postgresql://postgres:ENCODED_PW@host:6543/postgres?pgbouncer=true"; $env:DB_SSL="true"; node test-pg-cjs.js
// Usage (Bash):
// DATABASE_URL="postgresql://postgres:ENCODED_PW@host:6543/postgres?pgbouncer=true" DB_SSL=true node test-pg-cjs.js

const { Pool } = require('pg');
require('dotenv').config();

const useUrl = !!process.env.DATABASE_URL;
const connectionString = process.env.DATABASE_URL || (function () {
  const user = encodeURIComponent(process.env.DB_USER || 'postgres');
  const pass = encodeURIComponent(process.env.DB_PASSWORD || '');
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 5432;
  const db = process.env.DB_NAME || 'postgres';
  return `postgresql://${user}:${pass}@${host}:${port}/${db}`;
})();

const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

console.log('Testing Postgres connection...');
console.log('Connection source:', useUrl ? 'DATABASE_URL' : 'DB_* envs');
console.log('Host (from env):', process.env.DB_HOST || '(from URL)');

const pool = new Pool({ connectionString, ssl });

(async () => {
  try {
    const info = {
      connectionString: connectionString.replace(/:(?:[^@]+)@/, ':<REDACTED>@'),
      ssl: !!ssl
    };
    console.log('Using:', info);

    const res = await pool.query('SELECT NOW() as now');
    console.log('✅ Connected. DB time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Connection error:');
    console.error(err && err.message ? err.message : err);
    process.exitCode = 1;
  } finally {
    await pool.end().catch(()=>{});
  }
})();
