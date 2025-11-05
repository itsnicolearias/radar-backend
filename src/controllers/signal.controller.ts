import { Response, NextFunction } from 'express';
import SignalService from '../services/signal.service';
import { AuthRequest } from '../middlewares/auth.middleware';

class SignalController {
  async sendSignal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { note } = req.body;
      const senderId = req.user!.userId;

      const signal = await SignalService.createSignal(senderId, note);

      res.status(201).json(signal);
    } catch (error) {
      next(error);
    }
  }
}

export default new SignalController();
