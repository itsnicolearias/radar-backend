import { Response, NextFunction } from 'express';
import ProfileViewService from '../services/profileView.service';
import { AuthRequest } from '../middlewares/auth.middleware';

class ProfileViewController {
  async viewProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { viewedId } = req.body;

      const profileView = await ProfileViewService.createProfileView(req.user!.userId, viewedId);

      res.status(201).json({
      success: true,
      data: profileView,
    })
    } catch (error) {
      next(error);
    }
  }

  async getProfileViews(req: AuthRequest, res: Response, next: NextFunction) {
    try {

      const profileViews = await ProfileViewService.getProfileViews(req.user!.userId);

      res.status(201).json({
      success: true,
      data: profileViews,
    })
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileViewController();
