const { KOT, Order, OrderItem } = require('../models/index');
const { Op } = require('sequelize');

// Create KOT for an order
exports.createKOT = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    // Fetch the order with items
    const order = await Order.findByPk(orderId, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({ error: 'Cannot create KOT for order without items' });
    }

    // Generate KOT number
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    const kotsToday = await KOT.count({
      where: {
        createdAt: {
          [Op.between]: [
            new Date(today.setHours(0, 0, 0, 0)),
            new Date(today.setHours(23, 59, 59, 999))
          ]
        }
      }
    });

    const kotSeq = kotsToday + 1;
    const kotNumber = `KOT-${dateStr}-${kotSeq}`;

    // Format items for KOT
    const kotItems = order.items.map(item => ({
      itemName: item.itemName,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions || null
    }));

    // Create KOT
    const kot = await KOT.create({
      kotNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableNumber,
      section: order.section,
      waiterName: order.waiterName,
      items: kotItems,
      status: 'pending',
      notes: order.notes
    });

    res.status(201).json({
      success: true,
      message: 'KOT created successfully',
      data: kot
    });
  } catch (error) {
    next(error);
  }
};

// Get all KOTs
exports.getAllKOTs = async (req, res, next) => {
  try {
    const kots = await KOT.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(kots);
  } catch (error) {
    next(error);
  }
};

// Get KOTs by status
exports.getKOTsByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const kots = await KOT.findAll({
      where: { status },
      order: [['createdAt', 'DESC']]
    });
    res.json(kots);
  } catch (error) {
    next(error);
  }
};

// Get KOTs for a specific order
exports.getKOTsByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const kots = await KOT.findAll({
      where: { orderId },
      order: [['createdAt', 'DESC']]
    });
    res.json(kots);
  } catch (error) {
    next(error);
  }
};

// Update KOT status
exports.updateKOTStatus = async (req, res, next) => {
  try {
    const { kotId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'ready', 'served'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const kot = await KOT.findByPk(kotId);
    if (!kot) {
      return res.status(404).json({ error: 'KOT not found' });
    }

    kot.status = status;
    if (status === 'ready') {
      kot.completedAt = new Date();
    }
    await kot.save();

    res.json({
      success: true,
      message: 'KOT status updated',
      data: kot
    });
  } catch (error) {
    next(error);
  }
};

// Reprint KOT
exports.reprintKOT = async (req, res, next) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByPk(kotId);
    if (!kot) {
      return res.status(404).json({ error: 'KOT not found' });
    }

    // Increment version and update printed time
    kot.kotVersion = (kot.kotVersion || 1) + 1;
    kot.printedAt = new Date();
    await kot.save();

    res.json({
      success: true,
      message: 'KOT reprinted',
      data: kot
    });
  } catch (error) {
    next(error);
  }
};

// Get pending and preparing KOTs (Kitchen View)
exports.getKitchenKOTs = async (req, res, next) => {
  try {
    const kots = await KOT.findAll({
      where: {
        status: {
          [Op.in]: ['pending', 'preparing']
        }
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(kots);
  } catch (error) {
    next(error);
  }
};

// Delete KOT
exports.deleteKOT = async (req, res, next) => {
  try {
    const { kotId } = req.params;

    const kot = await KOT.findByPk(kotId);
    if (!kot) {
      return res.status(404).json({ error: 'KOT not found' });
    }

    await kot.destroy();

    res.json({
      success: true,
      message: 'KOT deleted'
    });
  } catch (error) {
    next(error);
  }
};
