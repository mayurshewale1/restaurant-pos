const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items
router.get('/', menuController.getAllMenus);

// Get single menu item by ID
router.get('/:id', menuController.getMenuById);

// Create new menu item
router.post('/', menuController.createMenu);

// Update menu item
router.put('/:id', menuController.updateMenu);

// Delete menu item
router.delete('/:id', menuController.deleteMenu);

module.exports = router;
