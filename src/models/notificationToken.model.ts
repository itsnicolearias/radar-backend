import { Model, DataTypes, Sequelize } from "sequelize";

class NotificationToken extends Model {
  public id!: number;
  public userId!: number;
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
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
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
