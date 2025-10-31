import sequelize from "../config/sequelize"
import User from "./user.model"
import Profile from "./profile.model"
import Message from "./message.model"
import Notification from "./notification.model"
import Connection from "./connection.model"
import NotificationToken, { init as initNotificationToken } from "./notificationToken.model"

initNotificationToken(sequelize)

const models = {
  User,
  Profile,
  Connection,
  Message,
  Notification,
  NotificationToken,
}

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models)
  }
})

export { sequelize, User, Profile, Connection, Message, Notification, NotificationToken }

export default models
