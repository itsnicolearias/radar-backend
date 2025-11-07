import { NotificationType } from "./notification.interface"

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
