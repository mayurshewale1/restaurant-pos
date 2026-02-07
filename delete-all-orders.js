/**
 * Delete All Orders from Database
 * Run: node delete-all-orders.js
 *
 * WARNING: This will permanently delete ALL orders and their items from the database!
 * Make sure to backup your data before running this script.
 */

require('dotenv').config();
const { connect } = require('./src/utils/db');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');

// Set up relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

async function deleteAllOrders() {
  try {
    console.log('🔄 Connecting to database...\n');
    await connect();

    console.log('⚠️  WARNING: This will delete ALL orders from the database!\n');

    // Get count before deletion
    const ordersCount = await Order.count();
    const itemsCount = await OrderItem.count();

    console.log(`📊 Current data:`);
    console.log(`   Orders: ${ordersCount}`);
    console.log(`   Order Items: ${itemsCount}\n`);

    if (ordersCount === 0) {
      console.log('ℹ️  No orders to delete. Database is already empty.\n');
      return;
    }

    // Confirm deletion (in a real script, you'd add user confirmation)
    console.log('🗑️  Deleting all orders...\n');

    // Delete all orders (CASCADE will delete order_items)
    const deletedOrders = await Order.destroy({
      where: {}, // Delete all
      cascade: true
    });

    console.log(`✅ Successfully deleted ${deletedOrders} orders.\n`);

    // Verify deletion
    const remainingOrders = await Order.count();
    const remainingItems = await OrderItem.count();

    console.log(`📊 After deletion:`);
    console.log(`   Orders: ${remainingOrders}`);
    console.log(`   Order Items: ${remainingItems}\n`);

    if (remainingOrders === 0 && remainingItems === 0) {
      console.log('✅ All orders and order items have been successfully deleted.');
    } else {
      console.log('⚠️  Some data may remain. Please check manually.');
    }

  } catch (error) {
    console.error('❌ Error deleting orders:', error.message);
    process.exit(1);
  }
}

// Run the deletion
deleteAllOrders().then(() => {
  console.log('\n🎉 Script completed.');
  process.exit(0);
});