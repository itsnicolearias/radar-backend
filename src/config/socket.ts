import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import { verifyToken } from "../utils/jwt"
import logger from "../utils/logger"

export interface SocketUser {
  userId: string
  email: string
}

export interface AuthenticatedSocket {
  id: string
  user: SocketUser
  join: (room: string) => void
  leave: (room: string) => void
  emit: (event: string, ...args: any[]) => void
  on: (event: string, callback: (...args: any[]) => void) => void
}

const userSockets = new Map<string, string>()

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
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
    } catch (error) {
      next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket: any) => {
    const userId = socket.user.userId
    logger.info(`User connected: ${userId}`)

    userSockets.set(userId, socket.id)

    socket.join(`user:${userId}`)

    socket.on("update-location", (data: { latitude: number; longitude: number }) => {
      logger.debug(`Location update from ${userId}`, data)

      io.to(`user:${userId}`).emit("location-updated", {
        userId,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      })
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
