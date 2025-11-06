import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("events", "is_boosted", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("events", "boosted_at", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("events", "is_boosted");
    await queryInterface.removeColumn("events", "boosted_at");
  },
};
