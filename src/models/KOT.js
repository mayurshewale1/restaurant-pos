const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const KOT = sequelize.define('KOT', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  kotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false
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
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of order items with quantity, name, special instructions'
  },
  status: {
    type: DataTypes.ENUM('pending', 'preparing', 'ready', 'served'),
    defaultValue: 'pending',
    allowNull: false
  },
  kotVersion: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Version number if KOT is reprinted or modified'
  },
  printedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'kots',
  indexes: [
    { fields: ['kotNumber'] },
    { fields: ['orderId'] },
    { fields: ['tableNumber'] },
    { fields: ['status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = KOT;
