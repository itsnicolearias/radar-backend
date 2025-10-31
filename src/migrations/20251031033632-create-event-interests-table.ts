import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("event_interests", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      event_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "events",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    })

    await queryInterface.addConstraint("event_interests", {
      fields: ["event_id", "user_id"],
      type: "unique",
      name: "event_interests_event_id_user_id_key",
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("event_interests")
  },
}
