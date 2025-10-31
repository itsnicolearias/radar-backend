import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as radarService from "../services/radar.service"
import * as notificationService from "../services/notification.service"
import type { GetNearbyUsersInput } from "../schemas/radar.schema"

export const getNearbyUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const data: GetNearbyUsersInput = {
      latitude: Number(req.query.latitude),
      longitude: Number(req.query.longitude),
      radius: req.query.radius ? Number(req.query.radius) : 1000,
    }

    const nearbyUsers = await radarService.getNearbyUsers(userId, data)

    if (nearbyUsers.length > 0) {
      await notificationService.sendRadarDetectionNotification(userId, nearbyUsers.length)
    }

    return res.status(200).json({
      success: true,
      data: nearbyUsers,
    })
  } catch (error) {
    return next(error)
  }
}
