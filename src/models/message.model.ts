import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"

export interface MessageAttributes {
  messageId: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
}

export interface MessageCreationAttributes extends Optional<MessageAttributes, "messageId" | "isRead" | "createdAt"> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public messageId!: string
  public senderId!: string
  public receiverId!: string
  public content!: string
  public isRead!: boolean
  public readonly createdAt!: Date
}

Message.init(
  {
    messageId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "message_id",
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      field: "sender_id",
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
      field: "receiver_id",
    },
    content: {
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
    tableName: "messages",
    timestamps: false,
  },
)

// Define associations
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
})

User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "receivedMessages",
})

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
})

Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
})

export default Message
