const express = require('express');
const router = express.Router();

const ordersRouter = require('./orders');
const menuRouter = require('./menu');
const staffRouter = require('./staff');
const inventoryRouter = require('./inventory');
const kotsRouter = require('./kots');

// health
router.get('/health', (req, res) => res.json({ status: 'ok' }));



router.use('/orders', ordersRouter);
router.use('/kots', kotsRouter);
router.use('/menu', menuRouter);
router.use('/staff', staffRouter);
router.use('/inventory', inventoryRouter);

module.exports = router;
