import { createClient, type RedisClientType } from "redis"
import dotenv from "dotenv"

dotenv.config()

let redisClient: RedisClientType | null = null

export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    })

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err)
    })

    await redisClient.connect()
    console.log("Redis connected successfully")
    return redisClient
  } catch (error) {
    console.error("Error connecting to Redis:", error)
    throw error
  }
}

export const getRedisClient = (): RedisClientType | null => {
  return redisClient
}

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

export default { connectRedis, getRedisClient, disconnectRedis }
