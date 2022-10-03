"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      "UserRole",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.UUID,
          references: {
            model: "User",
            key: "id",
          },
        },
        role_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "Role",
            key: "id",
          },
        },
      },
      {
        charset: "utf8",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("UserRole");
  },
};
