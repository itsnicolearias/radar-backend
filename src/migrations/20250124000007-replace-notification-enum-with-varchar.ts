import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.changeColumn("notifications", "type", {
      type: Sequelize.STRING(30),
      allowNull: false,
    })
  },

  down: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.changeColumn("notifications", "type", {
      type: Sequelize.ENUM("message", "connection_request", "connection_accept"),
      allowNull: false,
    })
  },
}
