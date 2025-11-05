import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user.model';

class ProfileView extends Model {
  public id!: number;
  public viewerId!: number;
  public viewedId!: number;
  public readonly createdAt!: Date;
}

export const initProfileViewModel = (sequelize: Sequelize) => {
  ProfileView.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      viewerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      viewedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ProfileView',
      tableName: 'profile_views',
      timestamps: true,
      updatedAt: false,
    }
  );
};

export { ProfileView };
