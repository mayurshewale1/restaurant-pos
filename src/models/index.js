const { sequelize } = require('../utils/db');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Menu = require('./Menu');
const Staff = require('./Staff');
const Inventory = require('./Inventory');
const KOT = require('./KOT');

// Define associations
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'items',
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

Order.hasMany(KOT, {
  foreignKey: 'orderId',
  as: 'kots',
  onDelete: 'CASCADE'
});

KOT.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Export all models
module.exports = {
  sequelize,
  Order,
  OrderItem,
  Menu,
  Staff,
  Inventory,
  KOT
};
