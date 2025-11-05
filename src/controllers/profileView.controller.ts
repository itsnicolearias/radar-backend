import { Response, NextFunction } from 'express';
import ProfileViewService from '../services/profileView.service';
import { AuthRequest } from '../middlewares/auth.middleware';

class ProfileViewController {
  async viewProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { viewedId } = req.body;
      const viewerId = parseInt(req.user!.userId, 10);

      const profileView = await ProfileViewService.createProfileView(viewerId, viewedId);

      res.status(201).json(profileView);
    } catch (error) {
      next(error);
    }
  }

  async getProfileViews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.user!.userId, 10);

      const profileViews = await ProfileViewService.getProfileViews(userId);

      res.status(200).json(profileViews);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileViewController();
