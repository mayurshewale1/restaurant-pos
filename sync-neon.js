require('dotenv').config();
const { sequelize } = require('./src/utils/db');
const models = require('./src/models');

console.log('🔄 Syncing database schema to Neon Cloud...\n');

(async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Connected to Neon Cloud\n');

    // Sync all models with force=false (won't drop existing tables)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database schema synced successfully!\n');
    
    // Show created tables
    const result = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('📋 Tables created:');
    result[0].forEach(t => console.log(`   ✓ ${t.table_name}`));
    
    console.log('\n🎉 Your Neon database is ready to use!');
    console.log('   Start your server with: npm run dev\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error.message);
    process.exit(1);
  }
})();
