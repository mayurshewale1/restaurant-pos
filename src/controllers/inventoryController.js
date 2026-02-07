const Inventory = require('../models/Inventory');

// Get all inventory items
exports.getAllInventory = async (req, res) => {
  try {
    const items = await Inventory.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// Add a new inventory item
exports.addInventory = async (req, res) => {
  try {
    const { name, currentStock, unit, minimumStock } = req.body;
    const item = await Inventory.create({ name, currentStock, unit, minimumStock });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add inventory item', details: err.message });
  }
};

// Update an inventory item
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, currentStock, unit, minimumStock } = req.body;
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.name = name;
    item.currentStock = currentStock;
    item.unit = unit;
    item.minimumStock = minimumStock;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory item', details: err.message });
  }
};
