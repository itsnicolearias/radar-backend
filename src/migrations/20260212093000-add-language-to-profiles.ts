import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.addColumn("profiles", "language", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "es",
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("profiles", "language")
  },
}
