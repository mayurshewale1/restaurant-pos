'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kots', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      kotNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      orderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tableNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      section: {
        type: Sequelize.STRING,
        allowNull: false
      },
      waiterName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      items: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: 'Array of order items with quantity, name, special instructions'
      },
      status: {
        type: Sequelize.ENUM('pending', 'preparing', 'ready', 'served'),
        defaultValue: 'pending',
        allowNull: false
      },
      kotVersion: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        comment: 'Version number if KOT is reprinted or modified'
      },
      printedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    });

    // Create indexes
    await queryInterface.addIndex('kots', ['kotNumber']);
    await queryInterface.addIndex('kots', ['orderId']);
    await queryInterface.addIndex('kots', ['tableNumber']);
    await queryInterface.addIndex('kots', ['status']);
    await queryInterface.addIndex('kots', ['createdAt']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kots');
  }
};
