import { Request, Response, NextFunction } from "express";
import subscriptionService from "../services/subscription.service";
import { AuthRequest } from "../../../interfaces/auth.interface";

class SubscriptionController {
  async createPreference(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { init_point } = await subscriptionService.createPreference(userId);
      res.status(201).json({ init_point });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const { body } = req;
      await subscriptionService.handleWebhook(body);
      res.status(200).json({ message: "Webhook received" });
    } catch (error) {
      next(error);
    }
  }
}

export default new SubscriptionController();
