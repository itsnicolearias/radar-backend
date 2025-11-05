import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Subscription } from '../models/subscription.model';
import { SubscriptionPlan } from '../models/subscriptionPlan.model';
import { Signal } from '../models/signal.model';
import boom from '@hapi/boom';
import { Op } from 'sequelize';

export const checkPlanLimits = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.user!.userId, 10);

    const subscription = await Subscription.findOne({
      where: { userId },
      include: [
        {
          model: SubscriptionPlan,
          as: 'plan',
        },
      ],
    });

    if (!subscription) {
      throw boom.forbidden('No active subscription found');
    }

    const planName = subscription.plan.name;

    if (planName === 'Free') {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const signalCount = await Signal.count({
        where: {
          senderId: userId,
          createdAt: {
            [Op.gte]: oneDayAgo,
          },
        },
      });

      if (signalCount >= 1) {
        throw boom.tooManyRequests('Free plan users can only send 1 signal every 24 hours');
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
