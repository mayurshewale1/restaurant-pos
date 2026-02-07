const { Order, OrderItem } = require('../models/index');
const { Op } = require('sequelize');

// Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// Create new order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, tableNumber, section, waiterName, subtotal, gst, discount, total, paymentMethod, notes } = req.body;

    // Normalize payment method to lowercase if provided
    const normalizedPaymentMethod = typeof paymentMethod === 'string' ? paymentMethod.toLowerCase() : paymentMethod;

    // Generate daily incrementing bill number
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
    // Count existing bills for today
    const todayStart = new Date(today.setHours(0,0,0,0));
    const todayEnd = new Date(today.setHours(23,59,59,999));
    const billsToday = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd]
        }
      }
    });
    const billSeq = billsToday + 1;
    const orderNumber = `BILL-${dateStr}-${billSeq}`;

    // Create order with transaction
    const order = await Order.create({
      orderNumber,
      tableNumber,
      section,
      waiterName,
      subtotal: subtotal || 0,
      gst: gst || 0,
      discount: discount || 0,
      total: total || 0,
      paymentMethod: normalizedPaymentMethod,
      notes,
      status: 'pending'
    });

    // Create order items if provided
    if (items && Array.isArray(items) && items.length > 0) {
      const orderItems = items.map(item => ({
        orderId: order.id,
        itemName: item.name || item.itemName,
        quantity: item.quantity || item.qty || 1,
        price: item.price,
        total: (item.quantity || item.qty || 1) * item.price,
        specialInstructions: item.notes || item.specialInstructions || null
      }));

      await OrderItem.bulkCreate(orderItems);
    }

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    next(error);
  }
};

// Update order
exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, items, subtotal, gst, discount, total, paymentMethod, notes, section } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order fields
    if (status !== undefined) order.status = status;
    if (subtotal !== undefined) order.subtotal = subtotal;
    if (gst !== undefined) order.gst = gst;
    if (discount !== undefined) order.discount = discount;
    if (total !== undefined) order.total = total;
    if (paymentMethod !== undefined) order.paymentMethod = typeof paymentMethod === 'string' ? paymentMethod.toLowerCase() : paymentMethod;
    if (notes !== undefined) order.notes = notes;
    if (section !== undefined) order.section = section;

    // Recalculate total if discount changed but total not provided
    if (discount !== undefined && total === undefined) {
      const baseTotal = (parseFloat(order.subtotal || 0) + parseFloat(order.gst || 0));
      order.total = baseTotal - parseFloat(discount || 0);
    }

    await order.save();

    // Update items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await OrderItem.destroy({ where: { orderId: id } });
      
      // Create new items
      const orderItems = items.map(item => ({
        orderId: id,
        itemName: item.name || item.itemName,
        quantity: item.quantity || item.qty || 1,
        price: item.price,
        total: (item.quantity || item.qty || 1) * item.price,
        specialInstructions: item.notes || item.specialInstructions || null
      }));

      await OrderItem.bulkCreate(orderItems);
    }

    // Fetch updated order with items
    const updatedOrder = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Delete order
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // OrderItems will be deleted automatically due to CASCADE
    await order.destroy();

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    
    const orders = await Order.findAll({
      where: { status },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get orders by table
exports.getOrdersByTable = async (req, res, next) => {
  try {
    const { tableNumber } = req.params;
    
    const orders = await Order.findAll({
      where: { tableNumber },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get analytics for dashboard
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const preparingOrders = await Order.count({ where: { status: 'preparing' } });
    const readyForBillingOrders = await Order.count({ where: { status: 'ready_for_billing' } });
    
    // Calculate total revenue
    const orders = await Order.findAll();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyForBillingOrders,
      totalRevenue
    });
  } catch (error) {
    next(error);
  }
};
