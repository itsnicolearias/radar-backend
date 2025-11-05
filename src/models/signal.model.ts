import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user.model';

class Signal extends Model {
  public id!: number;
  public senderId!: number;
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
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
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
