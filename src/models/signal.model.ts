import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user.model';

class Signal extends Model {
  public signal_id!: string;
  public senderId!: string;
  public note?: string;
  public readonly createdAt!: Date;

  public static associate(models: any) {
    Signal.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
  }
}

export const initSignalModel = (sequelize: Sequelize) => {
  Signal.init(
    {
      signal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
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
};

export { Signal };
