import http from "http"
import app from "./app"
import { sequelize } from "./models"
import { initializeSocket } from "./config/socket"
import { connectRedis } from "./config/redis"
import logger from "./utils/logger"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 3000

const httpServer = http.createServer(app)

initializeSocket(httpServer)

const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info("Database connection established successfully")

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false })
      logger.info("Database synchronized")
    }

    try {
      await connectRedis()
      logger.info("Redis connection established")
    } catch (redisError) {
      logger.warn("Redis connection failed, continuing without Redis", redisError)
    }

    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    logger.error("Unable to start server:", error)
    process.exit(1)
  }
}

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  httpServer.close(() => {
    logger.info("HTTP server closed")
  })
  await sequelize.close()
  process.exit(0)
})

startServer()
