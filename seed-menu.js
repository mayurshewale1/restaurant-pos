// Seed script to populate menu items into the database
// Usage: node seed-menu.js

require('dotenv').config();
const { sequelize, Menu } = require('./src/models');

const sampleMenuItems = [
  // Hot Drinks
  { name: 'Tea', description: 'Indian chai', price: 40, category: 'Hot Drinks', available: true },
  { name: 'Coffee', description: 'Black coffee', price: 50, category: 'Hot Drinks', available: true },
  { name: 'Milk', description: 'Hot milk', price: 30, category: 'Hot Drinks', available: true },
  
  // Cold Drinks
  { name: 'Lemonade', description: 'Fresh lemonade', price: 50, category: 'Cold Drinks', available: true },
  { name: 'Iced Tea', description: 'Cold tea', price: 60, category: 'Cold Drinks', available: true },
  { name: 'Soft Drink', description: 'Cola/Sprite', price: 70, category: 'Cold Drinks', available: true },
  
  // Salads
  { name: 'Garden Salad', description: 'Fresh vegetables', price: 150, category: 'Salads', available: true },
  { name: 'Caesar Salad', description: 'Romaine lettuce with croutons', price: 200, category: 'Salads', available: true },
  
  // Starters
  { name: 'Paneer Tikka', description: 'Grilled paneer cubes', price: 250, category: 'Paneer Starters', available: true },
  { name: 'Chicken Tikka', description: 'Grilled chicken', price: 300, category: 'Paneer Starters', available: true },
  { name: 'Spring Rolls', description: 'Vegetable spring rolls', price: 180, category: 'Papad', available: true },
  
  // Breakfast
  { name: 'Idli', description: 'South Indian steamed cake', price: 80, category: 'Breakfast', available: true },
  { name: 'Dosa', description: 'Crispy crepe', price: 100, category: 'Breakfast', available: true },
  { name: 'Upma', description: 'Semolina porridge', price: 90, category: 'Breakfast', available: true },
  
  // Sandwiches
  { name: 'Veg Sandwich', description: 'Vegetable sandwich', price: 120, category: 'Sandwiches', available: true },
  { name: 'Chicken Sandwich', description: 'Grilled chicken sandwich', price: 180, category: 'Sandwiches', available: true },
  
  // South Indian
  { name: 'Sambhar', description: 'South Indian lentil stew', price: 100, category: 'South Indian', available: true },
  { name: 'Rasam', description: 'South Indian soup', price: 80, category: 'South Indian', available: true },
  
  // Chinese
  { name: 'Chow Mein', description: 'Noodles with vegetables', price: 200, category: 'Chinese', available: true },
  { name: 'Fried Rice', description: 'Vegetable fried rice', price: 180, category: 'Chinese', available: true },
  
  // Chinese Rice
  { name: 'Egg Fried Rice', description: 'Fried rice with egg', price: 220, category: 'Chinese Rice', available: true },
  
  // Soup
  { name: 'Tomato Soup', description: 'Hot tomato soup', price: 100, category: 'Soup', available: true },
  { name: 'Vegetable Soup', description: 'Mixed vegetable soup', price: 120, category: 'Soup', available: true },
  
  // Main Course
  { name: 'Butter Naan', description: 'Buttered bread', price: 50, category: 'Tandoor Roti', available: true },
  { name: 'Parantha', description: 'Stuffed bread', price: 60, category: 'Paratha', available: true },
  { name: 'Butter Chicken', description: 'Chicken in creamy sauce', price: 350, category: 'Main Course/Veg Special', available: true },
  { name: 'Paneer Butter Masala', description: 'Paneer in creamy sauce', price: 300, category: 'Main Course Paneer Special', available: true },
  { name: 'Biryani', description: 'Fragrant rice dish', price: 400, category: 'Basmati Special', available: true },
];

(async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Sync models
    await sequelize.sync({ alter: false });
    console.log('✅ Models synced');
    
    // Clear existing menu items (optional)
    await Menu.destroy({ where: {}, truncate: true });
    console.log('✅ Cleared existing menu items');
    
    // Insert sample items
    const createdItems = await Menu.bulkCreate(sampleMenuItems);
    console.log(`✅ Created ${createdItems.length} menu items`);
    
    console.log('\n📋 Menu items created:');
    createdItems.forEach(item => {
      console.log(`   - ${item.name} (${item.category}) - ₹${item.price}`);
    });
    
    await sequelize.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
})();
