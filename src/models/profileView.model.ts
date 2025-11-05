import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user.model';

class ProfileView extends Model {
  public profile_view_id!: string;
  public viewerId!: string;
  public viewedId!: string;
  public readonly createdAt!: Date;
}

export const initProfileViewModel = (sequelize: Sequelize) => {
  ProfileView.init(
    {
      profile_view_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      viewerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'user_id',
        },
      },
      viewedId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: 'user_id',
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
