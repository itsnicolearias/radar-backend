import { Sequelize } from "sequelize"
import { config } from "./config"

const url = config.env === "test" ? config.dbTestUrl : config.dbUrl

const sequelize = new Sequelize(url || "", {
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
