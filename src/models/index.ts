import sequelize from "../config/sequelize";
import User from "./user.model";
import Profile from "./profile.model";
import Message from "./message.model";
import Notification from "./notification.model";
import Connection from "./connection.model";
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
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export {
  sequelize,
  User,
  Profile,
  Connection,
  Message,
  Notification,
  Event,
  EventInterest,
};

export default models;
