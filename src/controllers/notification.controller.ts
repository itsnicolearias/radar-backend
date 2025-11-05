import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as notificationService from "../services/notification.service"
import type { MarkNotificationsAsReadInput, NotificationTokenInput } from "../schemas/notification.schema"

export const saveToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { token } = req.body as NotificationTokenInput;
    const result = await notificationService.saveNotificationToken(userId, token);

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const deleteToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { token } = req.body as NotificationTokenInput;
    const result = await notificationService.deleteNotificationToken(userId, token);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
};

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const notifications = await notificationService.getNotificationsByUserId(userId)

    res.status(200).json({
      success: true,
      data: notifications,
    })
  } catch (error) {
    return next(error)
  }
}

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: MarkNotificationsAsReadInput = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await notificationService.markNotificationsAsRead(userId, data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
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

    const result = await notificationService.getUnreadNotificationCount(userId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.params
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await notificationService.deleteNotification(notificationId, userId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}
