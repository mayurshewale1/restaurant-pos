const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  currentStock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minimumStock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'inventory',
  timestamps: true,
});

module.exports = Inventory;
