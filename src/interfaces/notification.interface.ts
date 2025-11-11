import { NotificationType } from "./enums"

export interface INotificationResponse {
  notificationId: string
  userId: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IMarkNotificationsAsReadResponse {
  message: string
}

export interface IUnreadNotificationCountResponse {
  count: number
}

export interface IDeleteNotificationResponse {
  message: string
}

export interface NotificationAttributes {
  notificationId: string;
  userId: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationCreationAttributes extends Omit<NotificationAttributes, 'notificationId'>, Record<string, unknown> {}
