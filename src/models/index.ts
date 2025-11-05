import sequelize from "../config/sequelize"
import User from "./user.model"
import Profile from "./profile.model"
import Message from "./message.model"
import Notification from "./notification.model"
import Connection from "./connection.model"
import NotificationToken, { init as initNotificationToken } from "./notificationToken.model"

initNotificationToken(sequelize)

import Event from "./event.model";
import EventInterest from "./eventInterest.model";

const models = {
  User,
  Profile,
  Connection,
  Message,
  Notification,
  Event,
  EventInterest,
  NotificationToken,
};

type ModelsMap = Record<string, import('sequelize').ModelStatic<import('sequelize').Model<Record<string, unknown>, Record<string, unknown>>>>;

const modelValues = Object.values(models) as unknown as { associate?: (_models: ModelsMap) => void }[];
modelValues.forEach((m) => {
  if (m.associate) {
    m.associate(models as unknown as ModelsMap);
  }
});
// Associations are attached via each model's static `associate` method above

// Also export named models for convenience (so code can import { User } from '../models')
export { default as User } from "./user.model"
export { default as Profile } from "./profile.model"
export { default as Connection } from "./connection.model"
export { default as Message } from "./message.model"
export { default as Notification } from "./notification.model"
export { default as Event } from "./event.model"
export { default as EventInterest } from "./eventInterest.model"
export { default as NotificationToken } from "./notificationToken.model"

// Export sequelize instance for consumers that expect it from models index
export { default as sequelize } from "../config/sequelize"

// Backwards-compatible default export
export default models;
