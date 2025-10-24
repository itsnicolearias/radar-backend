import type { Dialect } from "sequelize"
import { config } from "./config"

interface DatabaseConfig {
  username: string
  password: string
  database: string
  host: string
  port: number
  dialect: Dialect
  logging: boolean
  dialectOptions?: {
    ssl?: {
      require: boolean
      rejectUnauthorized: boolean
    }
  }
}

interface Config {
  development: DatabaseConfig
  test: DatabaseConfig
  production: DatabaseConfig
}

const databaseConfig: Config = {
  development: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    dialect: "postgres",
    logging: true,
  },
  test: {
    username: config.dbUser,
    password: config.dbPassword,
    database: `${config.dbName}_test`,
    host: config.dbHost,
    port: config.dbPort,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}

export default databaseConfig
