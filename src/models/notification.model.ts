import { DataTypes, Model, BelongsToGetAssociationMixin } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"
import type {
  NotificationAttributes,
  NotificationCreationAttributes,
  NotificationType,
} from "../interfaces/notification.interface"

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
  public readonly updatedAt!: Date
  // association mixin
  public getUser!: BelongsToGetAssociationMixin<User>
  public User?: User
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
      type: DataTypes.STRING(30),
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
  }
)

// Define associations
User.hasMany(Notification, {
  foreignKey: "userId",
  as: "Notifications",
})

Notification.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
})

export default Notification
