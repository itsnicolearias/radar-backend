import { DataTypes, Model, type Optional } from "sequelize"
import sequelize from "../config/sequelize"
import User from "./user.model"

export interface ProfileAttributes {
  profileId: string
  userId: string
  bio: string | null
  age: number | null
  country: string | null
  province: string | null
  photoUrl: string | null
  interests: string[] | null
  showAge: boolean
  showLocation: boolean
  distanceRadius: number
  createdAt: Date
  updatedAt: Date
}

export interface ProfileCreationAttributes
  extends Optional<
    ProfileAttributes,
    | "profileId"
    | "bio"
    | "age"
    | "country"
    | "province"
    | "photoUrl"
    | "interests"
    | "showAge"
    | "showLocation"
    | "distanceRadius"
    | "createdAt"
    | "updatedAt"
  > {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public profileId!: string
  public userId!: string
  public bio!: string | null
  public age!: number | null
  public country!: string | null
  public province!: string | null
  public photoUrl!: string | null
  public interests!: string[] | null
  public showAge!: boolean
  public showLocation!: boolean
  public distanceRadius!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Profile.init(
  {
    profileId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "profile_id",
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
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "photo_url",
    },
    interests: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    showAge: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "show_age",
    },
    showLocation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "show_location",
    },
    distanceRadius: {
      type: DataTypes.INTEGER,
      defaultValue: 1000,
      field: "distance_radius",
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
    tableName: "profiles",
    timestamps: true,
    underscored: true,
  },
)

// Define associations
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile",
})

Profile.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
})

export default Profile
