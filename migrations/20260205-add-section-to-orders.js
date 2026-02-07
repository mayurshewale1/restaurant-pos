"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("orders", "section", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("orders", "section");
  }
};
