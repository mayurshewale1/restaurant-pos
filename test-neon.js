require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('🔄 Testing Neon Cloud Connection...\n');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SUCCESS! Connected to Neon Cloud Database\n');
    
    const result = await sequelize.query('SELECT version();');
    console.log('📊 Database Info:');
    console.log(`   PostgreSQL: ${result[0][0].version}\n`);
    
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables in neondb:');
    if (tables[0].length === 0) {
      console.log('   (No tables yet - you need to migrate your schema)');
    } else {
      tables[0].forEach(t => console.log(`   - ${t.table_name}`));
    }
    
    console.log('\n🎯 Connection Details:');
    console.log(`   Database: neondb`);
    console.log(`   User: neondb_owner`);
    console.log(`   Region: AWS US East 1`);
    console.log(`   SSL: Enabled ✅`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.log('❌ ERROR: Could not connect to Neon Cloud\n');
    console.log(`Error: ${error.message}\n`);
    process.exit(1);
  }
})();
