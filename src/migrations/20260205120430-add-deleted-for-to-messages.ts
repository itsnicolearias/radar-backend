'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.addColumn('messages', 'deleted_for', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('messages', 'deleted_for');
  },
};
