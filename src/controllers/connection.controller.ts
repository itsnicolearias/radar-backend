import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as connectionService from "../services/connection.service"
import type { CreateConnectionInput, UpdateConnectionInput } from "../schemas/connection.schema"

export const createConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: CreateConnectionInput = req.body
    const senderId = req.user?.userId

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const connection = await connectionService.createConnection(senderId, data)

    res.status(201).json({
      success: true,
      data: connection,
    })
  } catch (error) {
    return next(error)
  }
}

export const updateConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { connectionId } = req.params
    const data: UpdateConnectionInput = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const connection = await connectionService.updateConnection(connectionId, userId, data)

    res.status(200).json({
      success: true,
      data: connection,
    })
  } catch (error) {
    return next(error)
  }
}

export const getConnections = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const connections = await connectionService.getConnectionsByUserId(userId)

    res.status(200).json({
      success: true,
      data: connections,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteConnection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { connectionId } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await connectionService.deleteConnection(connectionId, userId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}
