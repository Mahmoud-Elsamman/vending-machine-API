'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Users',
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        username: { type: Sequelize.STRING, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        deposit: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
        role: { type: Sequelize.STRING, allowNull: true },
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    ),
      await queryInterface.createTable(
        'Products',
        {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
          amountAvailable: { type: Sequelize.INTEGER, allowNull: false },
          cost: { type: Sequelize.INTEGER, allowNull: false },
          productName: { type: Sequelize.STRING, allowNull: true },
          sellerId: { type: Sequelize.INTEGER, allowNull: false },
        },
        {
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
      ),
      await queryInterface.addConstraint('Products', {
        type: 'FOREIGN KEY',
        name: 'product_user_fk',
        fields: ['sellerId'],
        references: {
          table: 'Users',
          field: 'id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
