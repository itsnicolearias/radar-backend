/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import { verifyToken } from "../utils/jwt"
import { User } from "../models"
import logger from "../utils/logger"
import { config } from "./config"

export interface SocketUser {
  userId: string
  email: string
}

export interface AuthenticatedSocket {
  id: string
  user: SocketUser
  join: (_room: string) => void
  leave: (_room: string) => void
  emit: (_event: string, ..._args: any[]) => void

  on: (_event: string, _callback: (..._args: any[]) => void) => void
}

const userSockets = new Map<string, string>()

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.clientUrl || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error("Authentication error: No token provided"))
      }

      const decoded = verifyToken(token)
      socket.user = decoded
      next()
    } catch {
      next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket: any) => {
    const userId = socket.user.userId
    logger.info(`User connected: ${userId}`)

    userSockets.set(userId, socket.id)

    socket.join(`user:${userId}`)

    socket.on("update-location", async (data: { latitude: number; longitude: number }) => {
      try {
        logger.debug(`Location update from ${userId}`, data)

        const user = await User.findByPk(userId)
        if (user) {
          await user.update({
            lastLatitude: data.latitude,
            lastLongitude: data.longitude,
            lastSeenAt: new Date(),
          })

          if (user.isVerified && user.isVisible && !user.invisibleMode) {
            io.emit("location-updated", {
              userId,
              latitude: data.latitude,
              longitude: data.longitude,
              timestamp: new Date(),
            })
          }
        }
      } catch (error) {
        logger.error("Error updating location:", error)
      }
    })

    socket.on("toggle-visibility", async (data: { isVisible: boolean }) => {
      try {
        logger.debug(`Visibility toggle from ${userId}`, data)

        const user = await User.findByPk(userId)
        if (user) {
          await user.update({ isVisible: data.isVisible })

          socket.emit("visibility-updated", {
            userId,
            isVisible: user.isVisible,
            timestamp: new Date(),
          })
        }
      } catch (error) {
        logger.error("Error toggling visibility:", error)
      }
    })

    socket.on("send-message", (data: { receiverId: string; content: string }) => {
      logger.debug(`Message from ${userId} to ${data.receiverId}`)

      const receiverSocketId = userSockets.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-message", {
          senderId: userId,
          content: data.content,
          timestamp: new Date(),
        })
      }
    })

    socket.on("connection-request", (data: { receiverId: string }) => {
      logger.debug(`Connection request from ${userId} to ${data.receiverId}`)

      const receiverSocketId = userSockets.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("new-connection-request", {
          senderId: userId,
          timestamp: new Date(),
        })
      }
    })

    socket.on("connection-accepted", (data: { senderId: string }) => {
      logger.debug(`Connection accepted by ${userId} for ${data.senderId}`)

      const senderSocketId = userSockets.get(data.senderId)
      if (senderSocketId) {
        io.to(senderSocketId).emit("connection-request-accepted", {
          acceptedBy: userId,
          timestamp: new Date(),
        })
      }
    })

    socket.on("typing", (data: { receiverId: string }) => {
      const receiverSocketId = userSockets.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-typing", {
          userId,
        })
      }
    })

    socket.on("stop-typing", (data: { receiverId: string }) => {
      const receiverSocketId = userSockets.get(data.receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user-stopped-typing", {
          userId,
        })
      }
    })

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${userId}`)
      userSockets.delete(userId)
    })
  })

  return io
}

export const getIO = (): SocketIOServer | null => {
  return null
}

export default { initializeSocket, getIO }
