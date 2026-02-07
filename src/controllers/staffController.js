const { Staff } = require('../models');

// Create new staff member
exports.createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, shift, status, username, password } = req.body;
    if (!name || !email || !phone || !role || !shift || !username || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // TODO: Hash password in production
    const staff = await Staff.create({ name, email, phone, role, shift, status, username, password });
    res.status(201).json(staff);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email or username already exists' });
    }
    res.status(500).json({ error: 'Failed to create staff member' });
  }
};

// Get all staff members
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll();
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};
