import 'dotenv/config';
import sql from './src/utils/db-pg.js';

(async () => {
  try {
    const res = await sql`select now() as now`;
    console.log('DB time:', res[0].now);
    await sql.end({ timeout: 1 });
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
})();