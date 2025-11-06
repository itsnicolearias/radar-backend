import Signal from '../models/signal.model';
import User from '../models/user.model';
import sequelize, { Op } from 'sequelize';
import { GetNearbyUsersInput } from '../schemas/radar.schema';
import boom, { badRequest } from '@hapi/boom';

class SignalService {
  async getNearbySignals(data: GetNearbyUsersInput) {
    try {
      const { latitude, longitude, radius } = data;

      const nearbySignals = await Signal.findAll({
        // Filter by sender location using a spatial WHERE literal (avoid HAVING/GROUP BY issues)
        where: {
          [Op.and]: sequelize.literal(`
            ST_DWithin(
              ST_MakePoint(${longitude}, ${latitude})::geography,
              ST_MakePoint("sender"."last_longitude", "sender"."last_latitude")::geography,
              ${radius}
            )
          `),
        },
        include: [
          {
            model: User,
            as: 'sender',
            where: {
              lastLatitude: { [Op.ne]: null },
              lastLongitude: { [Op.ne]: null },
            },
            attributes: [],
          },
        ],
        attributes: {
          include: [
            [
              sequelize.literal(`
                ST_Distance(
                  ST_MakePoint(${longitude}, ${latitude})::geography,
                  ST_MakePoint("sender"."last_longitude", "sender"."last_latitude")::geography
                )
              `),
              'distance',
            ],
          ],
        },
        // spatial filter moved to WHERE
        order: [[sequelize.literal('distance'), 'ASC']],
        limit: 50,
      });

      return nearbySignals;
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

      const signal = await Signal.create({
        senderId,
        note,
      });

      return signal;
    } catch (error) {
      throw badRequest(error);
    }
  }
}

export default new SignalService();
