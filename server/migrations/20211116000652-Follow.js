'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     const transaction = await queryInterface.sequelize.transaction();
     try {
      await queryInterface.addColumn(
        'follow',
        'following_bookmark',
        {
          type: Sequelize.DataTypes.TINYINT,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'follow',
        'followed_bookmark',
        {
          type: Sequelize.DataTypes.TINYINT,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.sequelize.transaction( transaction => {
      return Promise.all([
        queryInterface.removeColumn('Follow', 'bookmark', {transaction: transaction})
      ])
    })
  }
};
