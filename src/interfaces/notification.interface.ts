export enum NotificationType {
  MESSAGE = "message",
  CONNECTION_REQUEST = "connection_request",
  CONNECTION_ACCEPT = "connection_accept",
}

export interface NotificationAttributes {
  notificationId: string
  userId: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: Date
}

export interface NotificationCreationAttributes {
  userId: string
  type: NotificationType
  message: string
  isRead?: boolean
}
