import Signal from '../models/signal.model';
import User from '../models/user.model';
import sequelize, { Op } from 'sequelize';
import boom, { badRequest } from '@hapi/boom';
import type { ISignalResponse } from '../interfaces/signal.interface';

class SignalService {
  async getNearbySignals(): Promise<ISignalResponse[]> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const nearbySignals = await Signal.findAll({
        attributes: [
          'senderId',
          [sequelize.fn('MAX', sequelize.col('createdAt')), 'maxCreatedAt'],
        ],
        where: {
          createdAt: {
            [Op.gte]: twentyFourHoursAgo,
          },
        },
        group: ['senderId'],
        raw: true,
      });

      const latestSignalIds = nearbySignals.map((signal: any) => signal.maxCreatedAt);

      const signals = await Signal.findAll({
        where: {
          createdAt: {
            [Op.in]: latestSignalIds,
          },
        },
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['userId', 'displayName'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return signals as unknown as ISignalResponse[];
    } catch (error) {
      throw badRequest(error);
    }
  }

  async createSignal(senderId: string, note?: string) {
    try {
      const user = await User.findByPk(senderId);
      if (!user) {
        throw boom.notFound('User not found');
      }

      if (!user.isVisible) {
        throw boom.forbidden('You must be visible to send signals');
      }

      const signal = await Signal.create({
        senderId,
        note,
      });

      return signal;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async getSignalById(signalId: string) {
    const signal = await Signal.findByPk(signalId, {
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['userId', 'displayName'],
        },
      ],
    });

    if (!signal) {
      throw boom.notFound('Signal not found');
    }

    return signal;
  }
}

export default new SignalService();
