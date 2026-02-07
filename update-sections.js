require('dotenv').config();
const { connect, sequelize } = require('./src/utils/db');
const { Order } = require('./src/models/index');

async function updateEmptySections() {
  try {
    console.log('🔄 Connecting to database...\n');
    await connect();

    console.log('📊 UPDATING ORDERS WITH EMPTY SECTIONS\n');

    // Update orders with empty section to 'Dinning'
    const [affectedRows] = await Order.update(
      { section: 'Dinning' },
      {
        where: {
          section: ''
        }
      }
    );

    console.log(`✅ Updated ${affectedRows} orders with empty section to 'Dinning'`);

    // Show updated orders
    const updatedOrders = await Order.findAll({
      where: { section: 'Dinning' },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    console.log('\n📋 Sample updated orders:');
    updatedOrders.forEach(order => {
      console.log(`- Order ${order.orderNumber}: Table ${order.tableNumber}, Section: ${order.section}`);
    });

  } catch (error) {
    console.error('Error updating sections:', error);
  } finally {
    await sequelize.close();
  }
}

updateEmptySections();