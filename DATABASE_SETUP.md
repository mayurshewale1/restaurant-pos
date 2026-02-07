# Database Setup Guide - PostgreSQL

## Quick Setup

### 1. Install PostgreSQL Locally (Development)
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

### 2. Install Node.js Dependencies
```bash
cd server
npm install pg sequelize sequelize-cli dotenv
# OR use Knex (query builder)
npm install pg knex dotenv
```

### 3. Create Database
```sql
CREATE DATABASE restaurant_management;
CREATE USER restaurant_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_management TO restaurant_user;
```

### 4. Environment Variables (.env)
```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_management
DB_USER=restaurant_user
DB_PASSWORD=your_secure_password

# Connection String (alternative)
DATABASE_URL=postgresql://restaurant_user:your_secure_password@localhost:5432/restaurant_management

# Keep MongoDB for now (optional)
MONGO_URI=mongodb://localhost:27017/restaurant_dev
```

### 5. Update db.js
```javascript
const { Sequelize } = require('sequelize');

// Use connection string or individual params
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

exports.connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    await sequelize.sync({ alter: false }); // Don't auto-sync in production
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

exports.sequelize = sequelize;
module.exports = sequelize;
```

---

## Schema Design (Example)

### Orders Table
```javascript
// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  waiterName: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  gst: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'upi', 'other')
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    { fields: ['orderNumber'] },
    { fields: ['tableNumber'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Order;
```

### OrderItems Table
```javascript
const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    references: { model: 'Orders', key: 'id' },
    allowNull: false
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

// Relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
```

---

## Cloud Hosting Quick Start

### Option 1: Supabase (Easiest)
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project
4. Copy connection string from Settings > Database
5. Add to .env file

### Option 2: DigitalOcean
1. Create Droplet or Managed Database
2. Get connection details
3. Update .env

### Option 3: AWS RDS
1. Create RDS PostgreSQL instance
2. Get endpoint and credentials
3. Update .env

---

## Testing Connection

```javascript
// test-db.js
require('dotenv').config();
const { connect } = require('./src/utils/db');

(async () => {
  try {
    await connect();
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
})();
```

Run: `node test-db.js`
