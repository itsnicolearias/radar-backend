import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware';
import * as messageService from '../services/message.service';

export const deleteConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await messageService.deleteConversation(userId, otherUserId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};
