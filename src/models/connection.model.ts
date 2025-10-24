import { DataTypes, Model } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"
import {
  ConnectionStatus,
  type ConnectionAttributes,
  type ConnectionCreationAttributes,
} from "../interfaces/connection.interface"

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
  },
)

// Define associations
User.hasMany(Connection, {
  foreignKey: "senderId",
  as: "sentConnections",
})

User.hasMany(Connection, {
  foreignKey: "receiverId",
  as: "receivedConnections",
})

Connection.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
})

Connection.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
})
