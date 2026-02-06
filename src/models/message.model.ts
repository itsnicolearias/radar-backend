import { DataTypes, Model, BelongsToGetAssociationMixin } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"
import Signal from "./signal.model"
import type {
  MessageAttributes,
  MessageCreationAttributes,
} from "../interfaces/message.interface"
import { decryptText, encryptText } from "../utils/crypto"

class Message
  extends Model<MessageAttributes, MessageCreationAttributes>
  implements MessageAttributes
{
  public messageId!: string
  public senderId!: string
  public receiverId!: string
  public signalId?: string | null
  public content!: string
  public iv!: string | null
  public authTag!: string | null
  public isRead!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  // Association mixins for sender/receiver
  public getSender!: BelongsToGetAssociationMixin<User>
  public getReceiver!: BelongsToGetAssociationMixin<User>
  public getSignal!: BelongsToGetAssociationMixin<Signal>
  public Sender?: User
  public Receiver?: User
  public Signal?: Signal
  public deletedFor:  string[] = []
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
    signalId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "signals",
        key: "signal_id",
      },
      onDelete: "SET NULL",
      field: "signal_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
        set(value: string) {
          this.setDataValue("content", encryptText(value))
        },
        get() {
          const rawValue = this.getDataValue("content")
          if (!rawValue) return null
          return decryptText(rawValue)
        },
      },
    iv: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authTag: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'auth_tag',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_read",
    },
    deletedFor: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      field: 'deleted_for',
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
  }
)

// Define associations
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "SentMessages",
})

User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "ReceivedMessages",
})

Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "Sender",
})

Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "Receiver",
})

Message.belongsTo(Signal, {
  foreignKey: "signalId",
  as: "Signal",
})

export default Message
