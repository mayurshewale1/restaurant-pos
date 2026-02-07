const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tableNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  waiterName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready_for_billing', 'completed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  gst: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'upi', 'other'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['orderNumber'] },
    { fields: ['tableNumber'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Order;
