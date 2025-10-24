import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("messages", {
      message_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      receiver_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      content: {
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

    await queryInterface.addIndex("messages", ["sender_id"])
    await queryInterface.addIndex("messages", ["receiver_id"])
    await queryInterface.addIndex("messages", ["created_at"])
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("messages")
  },
}
