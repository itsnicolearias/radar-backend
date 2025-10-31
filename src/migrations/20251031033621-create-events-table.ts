import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("events", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING(150),
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      max_attendees: {
        type: DataTypes.INTEGER,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    })
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("events")
  },
}
