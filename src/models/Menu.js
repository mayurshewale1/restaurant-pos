const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'menus',
  timestamps: true
});

module.exports = Menu;
