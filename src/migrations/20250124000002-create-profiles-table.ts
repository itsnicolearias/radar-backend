import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("profiles", {
      profile_id: {
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
        unique: true,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      province: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      photo_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      interests: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      show_age: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      show_location: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      distance_radius: {
        type: Sequelize.INTEGER,
        defaultValue: 1000,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    })

    await queryInterface.addIndex("profiles", ["user_id"])
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("profiles")
  },
}
