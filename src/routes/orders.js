const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Get all orders
router.get('/', ordersController.getAllOrders);

// Get orders by status
router.get('/status/:status', ordersController.getOrdersByStatus);

// Get orders by table
router.get('/table/:tableNumber', ordersController.getOrdersByTable);


// Get analytics for dashboard
router.get('/analytics', ordersController.getAnalytics);

// Get single order by ID
router.get('/:id', ordersController.getOrderById);

// Create new order
router.post('/', ordersController.createOrder);

// Update order
router.put('/:id', ordersController.updateOrder);

// Delete order
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
