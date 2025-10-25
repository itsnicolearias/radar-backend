import { Sequelize } from "sequelize"
import { config } from "./config"

const sequelize = new Sequelize(config.dbUrl || "", {
  dialect: "postgres",
  logging: config.env === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions:
    config.env === "production"
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
})

export default sequelize
