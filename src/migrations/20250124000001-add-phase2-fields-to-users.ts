import { type QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn("users", "birth_date", {
      type: DataTypes.DATE,
      allowNull: true,
    })

    await queryInterface.addColumn("users", "display_name", {
      type: DataTypes.STRING(50),
      allowNull: true,
    })

    await queryInterface.addColumn("users", "email_verification_token", {
      type: DataTypes.STRING(255),
      allowNull: true,
    })

    await queryInterface.addColumn("users", "is_visible", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    })
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn("users", "birth_date")
    await queryInterface.removeColumn("users", "display_name")
    await queryInterface.removeColumn("users", "email_verification_token")
    await queryInterface.removeColumn("users", "is_visible")
  },
}
