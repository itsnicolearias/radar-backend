'use strict';

import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.addColumn('users', 'notifications_enabled', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('users', 'notifications_enabled');
  }
};
