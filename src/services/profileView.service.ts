import { ProfileView } from '../models/profileView.model';
import User from '../models/user.model';
import boom, { badRequest } from '@hapi/boom';

class ProfileViewService {
  async createProfileView(viewerId: string, viewedId: string) {
    try {
      const viewer = await User.findByPk(viewerId);
      if (!viewer) {
        throw boom.notFound('Viewer not found');
      }

      const viewed = await User.findByPk(viewedId);
      if (!viewed) {
        throw boom.notFound('Viewed user not found');
      }

      const profileView = await ProfileView.create({
        viewerId,
        viewedId,
      });

      return profileView;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async getProfileViews(userId: string) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw boom.notFound('User not found');
      }

      const profileViews = await ProfileView.findAll({
        where: {
          viewedId: userId,
        },
        include: [
          {
            model: User,
            as: 'viewer',
            attributes: ['id', 'firstName', 'lastName', 'displayName'],
          },
        ],
      });

      return profileViews;
    } catch (error) {
      throw badRequest(error);
    }
  }
}

export default new ProfileViewService();
