import { DataTypes, Model, Optional, BelongsToGetAssociationMixin, BelongsToManyGetAssociationsMixin } from "sequelize"
import sequelize from "../config/sequelize"
type ModelsMap = Record<string, import('sequelize').ModelStatic<import('sequelize').Model<Record<string, unknown>, Record<string, unknown>>>>;
import type User from "./user.model"

interface EventAttributes {
  eventId: string
  userId: string
  title: string
  description?: string
  location?: string
  latitude?: number
  longitude?: number
  startDate: Date
  endDate?: Date
  isPublic: boolean
  maxAttendees?: number
  price?: number
}

type EventCreationAttributes = Optional<EventAttributes, "eventId">

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public eventId!: string
  public userId!: string
  public title!: string
  public description?: string
  public location?: string
  public latitude!: number
  public longitude!: number
  public startDate!: Date
  public endDate?: Date
  public isPublic!: boolean
  public maxAttendees?: number
  public price?: number

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  // association mixins
  public getOrganizer!: BelongsToGetAssociationMixin<User>
  public Organizer?: User
  public getInterestedUsers!: BelongsToManyGetAssociationsMixin<User>
  public InterestedUsers?: User[]

  public static associate(models: ModelsMap) {
    Event.belongsTo(models.User, {
      foreignKey: "userId",
      as: "Organizer",
    })
    Event.belongsToMany(models.User, {
      through: "EventInterest",
      as: "InterestedUsers",
      foreignKey: "eventId",
    })
  }
}

Event.init(
  {
    eventId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "event_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING(150),
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      field: "end_date",
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: "is_public",
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
      field: "max_attendees",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    sequelize,
    tableName: "events",
    timestamps: true,
    underscored: true,
  },
)

export default Event
