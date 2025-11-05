import { DataTypes, Model, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasManyGetAssociationsMixin, BelongsToManyGetAssociationsMixin } from "sequelize"
import type { ModelStatic } from "sequelize"
import sequelize from "../config/sequelize"
import type { UserAttributes, UserCreationAttributes } from "../interfaces/user.interface"
import type Profile from "./profile.model"
import type NotificationToken from "./notificationToken.model"
import type Event from "./event.model"
import type Message from "./message.model"

type ModelsMap = Record<string, ModelStatic<Model<Record<string, unknown>, Record<string, unknown>>>>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userId!: string
  public firstName!: string
  public lastName!: string
  public email!: string
  public passwordHash!: string
  public birthDate!: Date | null
  public displayName!: string | null
  public emailVerificationToken!: string | null
  public isVerified!: boolean
  public isVisible!: boolean
  public invisibleMode!: boolean
  public lastLatitude!: number | null
  public lastLongitude!: number | null
  public lastSeenAt!: Date | null
  public notificationsEnabled!: boolean
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  // Association mixins for profile (hasOne)
  public getProfile!: HasOneGetAssociationMixin<Profile>
  public setProfile!: HasOneSetAssociationMixin<Profile, string>
  public Profile?: Profile

  // Notifications tokens (hasMany)
  public getNotificationTokens!: HasManyGetAssociationsMixin<NotificationToken>
  public NotificationTokens?: NotificationToken[]

  // Organized events (hasMany)
  public getOrganizedEvents!: HasManyGetAssociationsMixin<Event>
  public OrganizedEvents?: Event[]

  // Interested events (belongsToMany)
  public getInterestedEvents!: BelongsToManyGetAssociationsMixin<Event>
  public InterestedEvents?: Event[]

  // Messages (hasMany)
  public getSentMessages!: HasManyGetAssociationsMixin<Message>
  public getReceivedMessages!: HasManyGetAssociationsMixin<Message>
  public SentMessages?: Message[]
  public ReceivedMessages?: Message[]

  public static associate(models: ModelsMap) {
    User.hasMany(models.NotificationToken, {
      foreignKey: "userId",
      as: "NotificationTokens",
    });
    User.hasMany(models.Event, {
      foreignKey: "userId",
      as: "OrganizedEvents",
    });
    User.belongsToMany(models.Event, {
      through: "EventInterest",
      as: "InterestedEvents",
      foreignKey: "userId",
    });
    // One-to-one relation with Profile
    User.hasOne(models.Profile, {
      foreignKey: "userId",
      as: "Profile",
    })
  }
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
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "birth_date",
    },
    displayName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "display_name",
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "email_verification_token",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_verified",
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_visible",
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
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "notifications_enabled",
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
  }
)

export default User
