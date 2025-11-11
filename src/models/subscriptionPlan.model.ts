import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";
import type { SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes } from "../interfaces/subscriptionPlan.interface";

class SubscriptionPlan extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes> implements SubscriptionPlanAttributes {
  public subscriptionPlanId!: string;
  public name!: string;
  public price!: number;
  public features!: Record<string, unknown>;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: Record<string, Model>) {
    SubscriptionPlan.hasMany(models.Subscription, {
      foreignKey: "planId",
      as: "subscriptions",
    });
  }
}

SubscriptionPlan.init(
  {
    subscriptionPlanId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "subscription_plan_id",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    tableName: "subscription_plans",
    timestamps: true,
    underscored: true,
  }
);

export default SubscriptionPlan;
