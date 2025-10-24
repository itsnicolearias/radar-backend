import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("notifications", {
      notification_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    })

    await queryInterface.addIndex("notifications", ["user_id"])
    await queryInterface.addIndex("notifications", ["is_read"])
    await queryInterface.addIndex("notifications", ["created_at"])
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("notifications")
  },
}
