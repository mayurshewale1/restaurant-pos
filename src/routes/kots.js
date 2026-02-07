const express = require('express');
const router = express.Router();
const kotController = require('../controllers/kotController');

// Get all KOTs
router.get('/', kotController.getAllKOTs);

// Get kitchen KOTs (pending and preparing only)
router.get('/kitchen/pending', kotController.getKitchenKOTs);

// Get KOTs by status
router.get('/status/:status', kotController.getKOTsByStatus);

// Get KOTs for a specific order
router.get('/order/:orderId', kotController.getKOTsByOrder);

// Create KOT for an order
router.post('/create/:orderId', kotController.createKOT);

// Update KOT status
router.put('/:kotId/status', kotController.updateKOTStatus);

// Reprint KOT
router.put('/:kotId/reprint', kotController.reprintKOT);

// Delete KOT
router.delete('/:kotId', kotController.deleteKOT);

module.exports = router;
