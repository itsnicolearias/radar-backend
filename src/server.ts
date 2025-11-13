import http from "http"
import app from "./app"
import { sequelize } from "./models"
import { initializeSocket, setSocketIo } from "./config/socket"
import { connectRedis } from "./config/redis"
import logger from "./utils/logger"
import { config } from "./config/config"

const httpServer = http.createServer(app)

const io = initializeSocket(httpServer);
setSocketIo(io);

const startServer = async () => {
  try {
    await sequelize.authenticate()
    logger.info("Database connection established successfully")

    if (config.env === "development") {
      await sequelize.sync({ alter: false })
      logger.info("Database synchronized")
    }

    try {
      await connectRedis()
      logger.info("Redis connection established")
    } catch (redisError) {
      logger.warn("Redis connection failed, continuing without Redis", redisError)
    }

    httpServer.listen(config.port, () => {
      logger.info(`Server is running on port ${config.port}`)
      logger.info(`Environment: ${config.env}`)
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
