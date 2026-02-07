module.exports = {
  development: {
    username: 'postgres',
    password: 'Mayur@123',
    database: 'restaurant_management',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USER || null,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || null,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
};
