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

User.hasMany(Event, { foreignKey: "userId", as: "organizedEvents" });
Event.belongsTo(User, { foreignKey: "userId", as: "organizer" });

User.belongsToMany(Event, {
  through: EventInterest,
  foreignKey: "userId",
  as: "interestedEvents",
});
Event.belongsToMany(User, {
  through: EventInterest,
  foreignKey: "eventId",
  as: "interestedUsers",
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
