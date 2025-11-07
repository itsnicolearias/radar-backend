import { badRequest } from "@hapi/boom"
import { NotificationType } from "../interfaces/notification.interface"
import { Notification } from "../models"
import type { MarkNotificationsAsReadInput } from "../schemas/notification.schema"
import type {
  INotificationResponse,
  IMarkNotificationsAsReadResponse,
  IUnreadNotificationCountResponse,
  IDeleteNotificationResponse,
} from "../interfaces/notification.interface"

export const createNotification = async (userId: string, type: NotificationType, message: string): Promise<INotificationResponse> => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      message,
    })

    return notification
  } catch (error) {
    throw badRequest(error);
  }
}

export const getNotificationsByUserId = async (userId: string) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    })

    return notifications
  } catch (error) {
    throw badRequest(error);
  }
}

export const markNotificationsAsRead = async (userId: string, data: MarkNotificationsAsReadInput) => {
  try {
    await Notification.update(
      { isRead: true },
      {
        where: {
          notificationId: data.notificationIds,
          userId,
        },
      }
    )

    return { message: "Notifications marked as read" }
  } catch (error) {
    throw badRequest(error);
  }
}

export const getUnreadNotificationCount = async (userId: string) => {
  try {
    const count = await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    return { count }
  } catch (error) {
    throw badRequest(error);
  }
}

export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    await Notification.destroy({
      where: {
        notificationId,
        userId,
      },
    })

    return { message: "Notification deleted successfully" }
  } catch (error) {
    throw badRequest(error);
  }
}
