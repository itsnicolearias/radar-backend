import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.changeColumn("connections", "status", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "pending",
    })
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.changeColumn("connections", "status", {
      type: Sequelize.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    })
  },
}
