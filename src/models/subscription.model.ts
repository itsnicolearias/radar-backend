import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import type { SubscriptionAttributes, SubscriptionCreationAttributes, SubscriptionStatus } from "../interfaces/subscription.interface";

class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes> implements SubscriptionAttributes {
  public id!: string;
  public userId!: string;
  public planId!: string;
  public status!: SubscriptionStatus;
  public startDate!: Date;
  public endDate!: Date;
  public mercadoPagoSubscriptionId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public plan!: { name: string; };

  public static associate(models: any) {
    Subscription.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Subscription.belongsTo(models.SubscriptionPlan, {
      foreignKey: "planId",
      as: "plan",
    });
  }
}

Subscription.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "user_id",
      },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "plan_id",
      references: {
        model: "subscription_plans",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "cancelled", "pending"),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    mercadoPagoSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mercado_pago_subscription_id",
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    underscored: true,
  }
);

export default Subscription;
