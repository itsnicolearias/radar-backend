import { Response, NextFunction } from 'express';
import SignalService from '../services/signal.service';
import { AuthRequest } from '../middlewares/auth.middleware';

class SignalController {
  async sendSignal(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { note } = req.body;

      const signal = await SignalService.createSignal(req.user!.userId, note);

      res.status(201).json(signal);
    } catch (error) {
      next(error);
    }
  }

  async getSignalById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id: signalId } = req.params;

      const signal = await SignalService.getSignalById(signalId);

      res.status(200).json(signal);
    } catch (error) {
      next(error);
    }
  }
}

export default new SignalController();
