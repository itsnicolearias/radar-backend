import sequelize from "../config/sequelize";
import User from "./user.model";
import Profile from "./profile.model";
import Message from "./message.model";
import Notification from "./notification.model";
import Connection from "./connection.model";
import Event from "./event.model";
import EventInterest from "./eventInterest.model";
import Subscription from "./subscription.model";
import SubscriptionPlan from "./subscriptionPlan.model";
import { Signal, initSignalModel } from "./signal.model";

initSignalModel(sequelize);

const models = {
  User,
  Signal,
  Profile,
  Connection,
  Message,
  Notification,
  Event,
  EventInterest,
  Subscription,
  SubscriptionPlan,
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
  Subscription,
  SubscriptionPlan,
};

export default models;
