import type { Dialect } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

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

const config: Config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "radar_db",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: true,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "radar_db_test",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
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

export default config
