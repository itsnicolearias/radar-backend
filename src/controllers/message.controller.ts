import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middleware/auth.middleware"
import * as messageService from "../services/message.service"
import type { SendMessageInput, MarkAsReadInput } from "../schemas/message.schema"

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: SendMessageInput = req.body
    const senderId = req.user?.userId

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const message = await messageService.sendMessage(senderId, data)

    res.status(201).json({
      success: true,
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.userId

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const messages = await messageService.getMessagesBetweenUsers(currentUserId, userId)

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: MarkAsReadInput = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await messageService.markMessagesAsRead(userId, data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await messageService.getUnreadMessageCount(userId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
