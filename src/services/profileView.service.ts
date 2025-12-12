import ProfileView from '../models/profileView.model';
import User from '../models/user.model';
import boom, { badRequest } from '@hapi/boom';
import type { IProfileViewResponse } from '../interfaces/profileView.interface';
import { Profile } from '../models';

class ProfileViewService {
  async createProfileView(viewerId: string, viewedId: string): Promise<IProfileViewResponse> {
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

      return {
        profileViewId: profileView.profileViewId,
        viewerId: profileView.viewerId,
        viewedId: profileView.viewedId,
        createdAt: profileView.createdAt,
        //updatedAt: profileView.updatedAt,
      };
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
            as: 'Viewer',
            attributes: ['userId', 'firstName', 'lastName', 'displayName'],
            include: [
              {
                model: Profile,
                attributes: ["photoUrl"],
                as: "Profile"
    
              },
          ],
          },
        ],
         order: [["createdAt", "DESC"]],
      });

      return profileViews;
    } catch (error) {
      throw badRequest(error);
    }
  }
}

export default new ProfileViewService();
