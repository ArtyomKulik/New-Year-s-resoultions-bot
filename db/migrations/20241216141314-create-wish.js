'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wishes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.BIGINT
      },
      chatId: {
         type: Sequelize.BIGINT,
      },
      videoIsSent: {
         type: Sequelize.BOOLEAN,
         defaultValue: false
      },
      videoIsDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
     },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wishes');
  }
};