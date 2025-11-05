import { sendToDevices } from "../config/firebase";
import { NotificationType } from "../interfaces/notification.interface";
import Notification from "../models/notification.model";
import NotificationToken from "../models/notificationToken.model";
import User from "../models/user.model";
import type { MarkNotificationsAsReadInput } from "../schemas/notification.schema";
import { badRequest } from "@hapi/boom"

export const sendPushNotification = async (userId: string, payload: import("firebase-admin").messaging.MessagingPayload) => {
  try {
    const user = await User.findByPk(userId, { include: [{ model: NotificationToken, as: "NotificationTokens" }] });

    if (user && user.notificationsEnabled && user.NotificationTokens) {
      const tokens = user.NotificationTokens.map((token) => token.token);
      if (tokens.length > 0) {
        await sendToDevices(tokens, payload)
      }
    }
  } catch (error) {
    throw badRequest(error);
  }
};

export const saveNotificationToken = async (userId: string, token: string) => {
  try {
    const [notificationToken] = await NotificationToken.findOrCreate({
      where: { token },
      defaults: { userId },
    });
    return notificationToken;
  } catch (error) {
    throw badRequest(error);
  }
};

export const deleteNotificationToken = async (userId: string, token: string) => {
  try {
    await NotificationToken.destroy({ where: { userId, token } });
    return { message: "Token deleted successfully" };
  } catch (error) {
    throw badRequest(error);
  }
};


export const createNotification = async (userId: string, type: NotificationType, message: string) => {
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

export const sendConnectionRequestNotification = async (userId: string, senderName: string) => {
  const payload = {
    notification: {
      title: "New Connection Request",
      body: `${senderName} sent you a connection request.`,
    },
  };
  await sendPushNotification(userId, payload);
};

export const sendNewMessageNotification = async (userId: string, senderName: string) => {
  const payload = {
    notification: {
      title: "New Message",
      body: `You have a new message from ${senderName}.`,
    },
  };
  await sendPushNotification(userId, payload);
};

export const sendConnectionAcceptedNotification = async (userId: string, acceptorName: string) => {
  const payload = {
    notification: {
      title: "Connection Accepted",
      body: `${acceptorName} accepted your connection request.`,
    },
  };
  await sendPushNotification(userId, payload);
};

export const sendRadarDetectionNotification = async (userId: string, count: number) => {
  const payload = {
    notification: {
      title: "New People Nearby",
      body: `There are ${count} new people on your radar.`,
    },
  };
  await sendPushNotification(userId, payload);
};

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
