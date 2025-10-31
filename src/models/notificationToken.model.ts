import { Model, DataTypes, Sequelize } from "sequelize";

class NotificationToken extends Model {
  public notificationTokenId!: string;
  public userId!: string;
  public token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate(models: any) {
    NotificationToken.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}

export const init = (sequelize: Sequelize) => {
  NotificationToken.init(
    {
      notificationTokenId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "notification_token_id",
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
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "notification_tokens",
      modelName: "NotificationToken",
    }
  );
};

export default NotificationToken;
