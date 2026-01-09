import "dotenv/config"
import { config } from "./config"

export = {
  development: {
    url: config.dbUrl,
    dialect: "postgres",
  },
  test: {
    url: config.dbTestUrl,
    dialect: "postgres",
  },
  production: {
    url: config.dbUrl,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
}
