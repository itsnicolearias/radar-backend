import { DataTypes, Model, BelongsToGetAssociationMixin } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"
import {
  type ConnectionAttributes,
  type ConnectionCreationAttributes,
} from "../interfaces/connection.interface"
import { ConnectionStatus } from "../interfaces/enums"

export class Connection
  extends Model<ConnectionAttributes, ConnectionCreationAttributes>
  implements ConnectionAttributes
{
  public connectionId!: string
  public senderId!: string
  public receiverId!: string
  public status!: ConnectionStatus
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  // association mixins
  public getSender!: BelongsToGetAssociationMixin<User>
  public getReceiver!: BelongsToGetAssociationMixin<User>
  public Sender?: User
  public Receiver?: User
}

Connection.init(
  {
    connectionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "connection_id",
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
    status: {
      type: DataTypes.STRING(20),
      defaultValue: ConnectionStatus.PENDING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "connections",
    timestamps: true,
    underscored: true,
  }
)

// Define associations
User.hasMany(Connection, {
  foreignKey: "senderId",
  as: "SentConnections",
})

User.hasMany(Connection, {
  foreignKey: "receiverId",
  as: "ReceivedConnections",
})

Connection.belongsTo(User, {
  foreignKey: "senderId",
  as: "Sender",
})

Connection.belongsTo(User, {
  foreignKey: "receiverId",
  as: "Receiver",
})

export default Connection
