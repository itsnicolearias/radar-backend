import { createClient, type RedisClientType } from "redis"
import { config } from "./config"
import { badRequest } from "@hapi/boom"

let redisClient: RedisClientType | null = null

export const connectRedis = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient
  }

  try {
    redisClient = createClient({
      url: config.redisUrl || "redis://localhost:6379",
    })

    redisClient.on("error", (err) => {
      throw err
    })

    await redisClient.connect()
    return redisClient
  } catch (error) {
    throw badRequest(error);
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
