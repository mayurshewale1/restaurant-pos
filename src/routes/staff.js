const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// POST /api/staff - Add staff member
router.post('/', staffController.createStaff);

// GET /api/staff - List all staff
router.get('/', staffController.getAllStaff);

module.exports = router;
