import Signal from '../models/signal.model';
import User from '../models/user.model';
import sequelize, { Op } from 'sequelize';
import boom, { badRequest } from '@hapi/boom';
import type { ISignalResponse } from '../interfaces/signal.interface';
import { GetNearbyUsersInput } from '../schemas/radar.schema';

class SignalService {
  async getNearbySignals(data: GetNearbyUsersInput): Promise<ISignalResponse[]> {
    try {
      const { latitude, longitude, radius } = data;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const subquery = `
        SELECT
          "sender_id",
          MAX("created_at") AS "maxCreatedAt"
        FROM
          signals
        WHERE
          "created_at" >= '${twentyFourHoursAgo.toISOString()}'
        GROUP BY
          "sender_id"
      `;

      const signals = await Signal.findAll({
        where: {
          [Op.and]: [
            sequelize.literal(`("Signal"."sender_id", "Signal"."created_at") IN (${subquery})`),
            sequelize.literal(`
              ST_DWithin(
                ST_MakePoint(${longitude}, ${latitude})::geography,
                ST_MakePoint("Sender"."last_longitude", "Sender"."last_latitude")::geography,
                ${radius}
              )
            `),
          ],
        },
        include: [
          {
            model: User,
            as: 'Sender',
            attributes: ['userId', 'displayName'],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: 50,
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
