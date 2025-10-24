import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"

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

export interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "notificationId" | "isRead" | "createdAt"> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public notificationId!: string
  public userId!: string
  public type!: NotificationType
  public message!: string
  public isRead!: boolean
  public readonly createdAt!: Date
}

Notification.init(
  {
    notificationId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "notification_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      field: "user_id",
    },
    type: {
      type: DataTypes.ENUM("message", "connection_request", "connection_accept"),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_read",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    tableName: "notifications",
    timestamps: false,
  },
)

// Define associations
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "notifications",
})

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

export default Notification
