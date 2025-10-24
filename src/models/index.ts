import sequelize from "../config/sequelize"
import User from "./user.model"
import Profile from "./profile.model"
import Message from "./message.model"
import Notification from "./notification.model"
import Connection from "./connection.model"

const models = {
  User,
  Profile,
  Connection,
  Message,
  Notification,
}

export { sequelize, User, Profile, Connection, Message, Notification }

export default models
