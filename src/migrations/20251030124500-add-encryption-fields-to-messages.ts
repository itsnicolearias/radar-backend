import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.addColumn('messages', 'iv', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'auth_tag', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'content', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.removeColumn('messages', 'iv');
    await queryInterface.removeColumn('messages', 'auth_tag');
    await queryInterface.changeColumn('messages', 'content', {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },
};
