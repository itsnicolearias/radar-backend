import admin from "../config/firebase";
import { NotificationType } from "../interfaces/notification.interface";
import { Notification, NotificationToken, User } from "../models";
import type { MarkNotificationsAsReadInput } from "../schemas/notification.schema";

export const sendPushNotification = async (userId: string, payload: admin.messaging.MessagingPayload) => {
  try {
    const user = await User.findByPk(userId, { include: ["notificationTokens"] });

    if (user && user.notificationsEnabled && user.notificationTokens) {
      const tokens = user.notificationTokens.map((token) => token.token);
      if (tokens.length > 0) {
        await admin.messaging().sendToDevice(tokens, payload);
      }
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
    // Depending on the desired behavior, you might want to re-throw the error
    // or handle it gracefully.
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
    throw error;
  }
};

export const deleteNotificationToken = async (userId: string, token: string) => {
  try {
    await NotificationToken.destroy({ where: { userId, token } });
    return { message: "Token deleted successfully" };
  } catch (error) {
    throw error;
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
    throw error
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
    throw error
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
      },
    )

    return { message: "Notifications marked as read" }
  } catch (error) {
    throw error
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
    throw error
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
    throw error
  }
}
