/**
 * View PostgreSQL Database Data
 * Run: node view-db-data.js
 * 
 * This script shows you all the data in your database tables
 */

require('dotenv').config();
const { connect, sequelize } = require('./src/utils/db');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');

// Set up relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

async function viewDatabaseData() {
  try {
    console.log('🔄 Connecting to database...\n');
    await connect();
    
    console.log('📊 DATABASE DATA VIEWER\n');
    console.log('='.repeat(60));
    
    // Get Orders Count
    const ordersCount = await Order.count();
    console.log(`\n📦 TOTAL ORDERS: ${ordersCount}\n`);
    
    if (ordersCount === 0) {
      console.log('⚠️  No orders found in database.');
      console.log('💡 Tip: Create some orders through your app to see data here.\n');
    } else {
      // Get All Orders
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']],
        limit: 20 // Show last 20 orders
      });
      
      console.log('📋 RECENT ORDERS (Last 20):\n');
      console.log('-'.repeat(60));
      
      for (const order of orders) {
        console.log(`\n🆔 Order #${order.orderNumber}`);
        console.log(`   Table: ${order.tableNumber}`);
        console.log(`   Section: ${order.section || 'N/A'}`);
        console.log(`   Waiter: ${order.waiterName || 'N/A'}`);
        console.log(`   Status: ${order.status.toUpperCase()}`);
        console.log(`   Amount: ₹${parseFloat(order.total).toFixed(2)}`);
        console.log(`   Payment: ${order.paymentMethod || 'N/A'}`);
        console.log(`   Date: ${order.createdAt.toLocaleString()}`);
        
        // Get order items
        const items = await OrderItem.findAll({
          where: { orderId: order.id }
        });
        
        if (items.length > 0) {
          console.log(`   Items (${items.length}):`);
          items.forEach(item => {
            console.log(`     - ${item.quantity}x ${item.itemName} - ₹${parseFloat(item.price).toFixed(2)}`);
          });
        }
        console.log('-'.repeat(60));
      }
      
      // Statistics
      console.log('\n📈 STATISTICS:\n');
      
      const byStatus = await Order.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total')), 'total']
        ],
        group: ['status']
      });
      
      console.log('Orders by Status:');
      byStatus.forEach(stat => {
        const count = stat.getDataValue('count');
        const total = stat.getDataValue('total') || 0;
        console.log(`  ${stat.status.padEnd(15)}: ${count} orders | Total: ₹${parseFloat(total).toFixed(2)}`);
      });
      
      // Total Revenue
      const totalRevenue = await Order.sum('total', {
        where: { status: 'completed' }
      });
      
      console.log(`\n💰 Total Revenue (Completed Orders): ₹${(totalRevenue || 0).toFixed(2)}`);
      
      // Payment Methods
      const byPayment = await Order.findAll({
        attributes: [
          'paymentMethod',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['paymentMethod']
      });
      
      console.log('\n💳 Payment Methods:');
      byPayment.forEach(stat => {
        const method = stat.paymentMethod || 'N/A';
        const count = stat.getDataValue('count');
        console.log(`  ${method.padEnd(15)}: ${count} orders`);
      });
    }
    
    // Get Order Items Count
    const itemsCount = await OrderItem.count();
    console.log(`\n📦 TOTAL ORDER ITEMS: ${itemsCount}\n`);
    
    console.log('='.repeat(60));
    console.log('\n✅ Data displayed successfully!');
    console.log('\n💡 Tip: Use pgAdmin or psql for more detailed database viewing.\n');
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR viewing database data:');
    console.error(error.message);
    console.error('\n📝 Make sure:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. .env file has correct credentials');
    console.error('   3. Database and tables exist\n');
    process.exit(1);
  }
}

// Run the viewer
viewDatabaseData();
