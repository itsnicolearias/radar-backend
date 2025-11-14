/* eslint-disable no-unused-vars */
export interface INotificationResponse {
  notificationId: string
  userId: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export enum NotificationType {
  MESSAGE = "message",
  CONNECTION_REQUEST = "connection_request",
  CONNECTION_ACCEPT = "connection_accept",
  SIGNAL_REPLY = "signal_reply",
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
