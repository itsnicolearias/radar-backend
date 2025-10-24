import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/sequelize"

export interface UserAttributes {
  userId: string
  firstName: string
  lastName: string
  email: string
  passwordHash: string
  isVerified: boolean
  invisibleMode: boolean
  lastLatitude: number | null
  lastLongitude: number | null
  lastSeenAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "userId"
    | "isVerified"
    | "invisibleMode"
    | "lastLatitude"
    | "lastLongitude"
    | "lastSeenAt"
    | "createdAt"
    | "updatedAt"
  > {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userId!: string
  public firstName!: string
  public lastName!: string
  public email!: string
  public passwordHash!: string
  public isVerified!: boolean
  public invisibleMode!: boolean
  public lastLatitude!: number | null
  public lastLongitude!: number | null
  public lastSeenAt!: Date | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "user_id",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_verified",
    },
    invisibleMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "invisible_mode",
    },
    lastLatitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      field: "last_latitude",
    },
    lastLongitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
      field: "last_longitude",
    },
    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_seen_at",
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
    tableName: "users",
    timestamps: true,
    underscored: true,
  },
)

export default User
