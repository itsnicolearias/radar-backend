import { Model, DataTypes } from 'sequelize';
import User from './user.model';
import sequelize from "../config/sequelize"

class ProfileView extends Model {
  public profileViewId!: string;
  public viewerId!: string;
  public viewedId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

  ProfileView.init(
    {
      profileViewId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: "profile_view_id"
      },
      viewerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "viewer_id",
        references: {
          model: User,
          key: 'user_id',
        },
      },
      viewedId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "viewed_id",
        references: {
          model: User,
          key: 'user_id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at"
      },
    },
    {
      sequelize,
      modelName: 'ProfileView',
      tableName: 'profile_views',
      timestamps: true,
    }
  );

// Define associations
User.hasMany(ProfileView, {
  foreignKey: "viewerId",
  as: "Viewer",
})

User.hasMany(ProfileView, {
  foreignKey: "viewedId",
  as: "Viewed",
})

ProfileView.belongsTo(User, {
  foreignKey: "viewerId",
  as: "Viewer",
})

ProfileView.belongsTo(User, {
  foreignKey: "viewedId",
  as: "Viewed",
})

export default ProfileView;
