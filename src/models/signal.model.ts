import { Model, DataTypes } from 'sequelize';
import User from './user.model';
import sequelize from "../config/sequelize"

class Signal extends Model {
  public signal_id!: string;
  public senderId!: string;
  public note?: string;
  public readonly createdAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static associate(models: any) {
    Signal.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
  }
}


  Signal.init(
    {
      signalId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "signal_id"
      },
      senderId: {
        type: DataTypes.UUID,
        field: "sender_id",
        allowNull: false,
        references: {
          model: User,
          key: 'user_id',
        },
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Signal',
      tableName: 'signals',
      timestamps: true,
      updatedAt: false,
    }
  );

export default Signal;
