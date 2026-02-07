const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'order_items',
  indexes: [
    { fields: ['orderId'] }
  ]
});

// Associations will be set up in index.js
module.exports = OrderItem;
