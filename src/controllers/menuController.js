const { Menu } = require('../models');

// Get all menu items
exports.getAllMenus = async (req, res, next) => {
  try {
    const menus = await Menu.findAll({ order: [['createdAt', 'DESC']] });
    res.json(menus);
  } catch (error) {
    next(error);
  }
};

// Get single menu item by ID
exports.getMenuById = async (req, res, next) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menu);
  } catch (error) {
    next(error);
  }
};

// Create new menu item
exports.createMenu = async (req, res, next) => {
  try {
    const { name, description, price, category, available } = req.body;
    const menu = await Menu.create({ name, description, price, category, available });
    res.status(201).json(menu);
  } catch (error) {
    next(error);
  }
};

// Update menu item
exports.updateMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu item not found' });
    const { name, description, price, category, available } = req.body;
    await menu.update({ name, description, price, category, available });
    res.json(menu);
  } catch (error) {
    next(error);
  }
};

// Delete menu item
exports.deleteMenu = async (req, res, next) => {
  try {
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ error: 'Menu item not found' });
    await menu.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
