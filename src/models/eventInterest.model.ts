import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/sequelize"

interface EventInterestAttributes {
  id: string
  eventId: string
  userId: string
}

type EventInterestCreationAttributes = Optional<EventInterestAttributes, "id">

class EventInterest
  extends Model<EventInterestAttributes, EventInterestCreationAttributes>
  implements EventInterestAttributes
{
  public id!: string
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
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
