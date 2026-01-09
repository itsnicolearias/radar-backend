import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('messages', 'type', {
      type: DataTypes.ENUM('text', 'image', 'audio'),
      defaultValue: 'text',
      allowNull: false,
    });
    await queryInterface.addColumn('messages', 'media_key', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'media_mime_type', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'media_duration', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'content', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('messages', 'type');
    await queryInterface.removeColumn('messages', 'media_key');
    await queryInterface.removeColumn('messages', 'media_mime_type');
    await queryInterface.removeColumn('messages', 'media_duration');
    await queryInterface.changeColumn('messages', 'content', {
      type: DataTypes.TEXT,
      allowNull: false,
    });
  },
};
