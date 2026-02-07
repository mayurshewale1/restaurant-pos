/**
 * Script to Update Order Status Enum in PostgreSQL
 * Run: node update-order-status-enum.js
 * 
 * This script adds 'ready_for_billing' status to the orders enum type
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'restaurant_management',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
  }
);

async function updateEnum() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected to database\n');

    console.log('🔄 Adding "ready_for_billing" to enum_orders_status...');
    
    // Check if the enum value already exists
    const [results] = await sequelize.query(`
      SELECT unnest(enum_range(NULL::enum_orders_status)) AS enum_value;
    `);
    
    const enumValues = results.map(r => r.enum_value);
    console.log('Current enum values:', enumValues);
    
    if (enumValues.includes('ready_for_billing')) {
      console.log('✅ "ready_for_billing" already exists in enum');
    } else {
      // Add the new enum value
      await sequelize.query(`
        ALTER TYPE enum_orders_status ADD VALUE IF NOT EXISTS 'ready_for_billing';
      `);
      console.log('✅ Successfully added "ready_for_billing" to enum_orders_status');
    }
    
    // Verify the enum values
    const [newResults] = await sequelize.query(`
      SELECT unnest(enum_range(NULL::enum_orders_status)) AS enum_value;
    `);
    
    console.log('\n📋 Updated enum values:');
    newResults.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.enum_value}`);
    });
    
    console.log('\n✅ Database enum updated successfully!');
    console.log('💡 You can now use "ready_for_billing" status in your orders.\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR updating enum:');
    console.error(error.message);
    console.error('\n📝 Troubleshooting:');
    console.error('1. Make sure PostgreSQL is running');
    console.error('2. Check .env file has correct database credentials');
    console.error('3. Verify you have permissions to alter enum types');
    console.error('4. Try running the SQL script directly: add_ready_for_billing_status.sql\n');
    process.exit(1);
  }
}

updateEnum();
