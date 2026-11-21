import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.addColumn("profiles", "photo_storage_provider", {
      type: Sequelize.STRING(20),
      allowNull: true,
    })
    await queryInterface.addColumn("profiles", "cloudinary_public_id", {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("profiles", "cloudinary_public_id")
    await queryInterface.removeColumn("profiles", "photo_storage_provider")
  },
}
