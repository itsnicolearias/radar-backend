import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/sequelize"

interface EventInterestAttributes {
  eventInterestId: string
  eventId: string
  userId: string
}

type EventInterestCreationAttributes = Optional<EventInterestAttributes, "eventInterestId">

class EventInterest
  extends Model<EventInterestAttributes, EventInterestCreationAttributes>
  implements EventInterestAttributes
{
  public eventInterestId!: string
  public eventId!: string
  public userId!: string

  public readonly createdAt!: Date

  public static associate(models: any) {
    EventInterest.belongsTo(models.Event, {
      foreignKey: "eventId",
    })
    EventInterest.belongsTo(models.User, {
      foreignKey: "userId",
    })
  }
}

EventInterest.init(
  {
    eventInterestId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "event_interest_id",
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "event_id",
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    sequelize,
    tableName: "event_interests",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
)

export default EventInterest
