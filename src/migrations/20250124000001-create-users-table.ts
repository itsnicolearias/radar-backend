import type { QueryInterface, DataTypes } from "sequelize"

export default {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      invisible_mode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      last_latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      last_longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      last_seen_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("users", ["email"])
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users")
  },
}
