"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "Role",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
      },
      {
        charset: "utf8",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("Role");
  },
};
