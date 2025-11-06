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
import Signal from "./signal.model";
import ProfileView from "./profileView.model";

const models = {
  User,
  Profile,
  Connection,
  Message,
  Notification,
  Event,
  EventInterest,
  Subscription,
  SubscriptionPlan,
  Signal,
  ProfileView,
};

type ModelsMap = Record<string, import('sequelize').ModelStatic<import('sequelize').Model<Record<string, unknown>, Record<string, unknown>>>>;

const modelValues = Object.values(models) as unknown as { associate?: (_models: ModelsMap) => void }[];
modelValues.forEach((m) => {
  if (m.associate) {
    m.associate(models as unknown as ModelsMap);
  }
});
// Associations are attached via each model's static `associate` method above

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
  Signal,
  ProfileView
};

// Backwards-compatible default export
export default models;
