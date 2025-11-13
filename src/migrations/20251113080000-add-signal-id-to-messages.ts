'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.addColumn('messages', 'signal_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'signals',
        key: 'signal_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('messages', 'signal_id');
  },
};
