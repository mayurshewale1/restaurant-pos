/**
 * Test PostgreSQL Connection
 * Run: node test-db.js
 */

require('dotenv').config();
const { connect } = require('./src/utils/db');

(async () => {
  try {
    console.log('🔄 Testing PostgreSQL connection...');
    console.log('Database:', process.env.DB_NAME || 'restaurant_management');
    console.log('Host:', process.env.DB_HOST || 'localhost');
    console.log('Port:', process.env.DB_PORT || 5432);
    console.log('User:', process.env.DB_USER || 'postgres');
    console.log('');

    await connect();
    
    console.log('');
    console.log('✅ SUCCESS: Database connection test passed!');
    console.log('✅ Your PostgreSQL setup is working correctly.');
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ ERROR: Database connection failed!');
    console.error('');
    console.error('Error details:');
    console.error(error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify .env file has correct credentials');
    console.error('3. Ensure database exists: CREATE DATABASE restaurant_management;');
    console.error('4. Check PostgreSQL user permissions');
    process.exit(1);
  }
})();
