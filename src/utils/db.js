const { Sequelize } = require('sequelize');

// Determine SSL config (for Supabase or managed databases)
const dialectOptions = {};
if (process.env.DB_SSL === 'true') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false // Allow self-signed certs
  };
}

// Create Sequelize instance
let sequelize;
if (process.env.DATABASE_URL) {
  // Use full DATABASE_URL when provided (preferred for Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  });
} else {
  // Fall back to individual DB_* env vars (for local development)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'restaurant_management',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      dialectOptions,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false
      }
    }
  );
}

// Connection function
const connect = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database');
    
    // Sync models (only in development - use migrations in production)
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: process.env.DB_SYNC === 'true' });
      console.log('✅ Database models synchronized');
    }
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    throw error;
  }
};

// Export both connect function and sequelize instance
module.exports = {
  connect,
  sequelize
};
