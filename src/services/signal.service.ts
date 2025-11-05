import { Signal } from '../models/signal.model';
import User from '../models/user.model';
import boom from '@hapi/boom';
import sequelize from 'sequelize';
import { GetNearbyUsersInput } from '../schemas/radar.schema';

class SignalService {
  async getNearbySignals(data: GetNearbyUsersInput) {
    try {
      const { latitude, longitude, radius } = data;

      const nearbySignals = await Signal.findAll({
        include: [
          {
            model: User,
            as: 'sender',
            where: {
              lastLatitude: { [sequelize.Op.ne]: null },
              lastLongitude: { [sequelize.Op.ne]: null },
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
        having: sequelize.literal(`
          ST_DWithin(
            ST_MakePoint(${longitude}, ${latitude})::geography,
            ST_MakePoint("sender"."last_longitude", "sender"."last_latitude")::geography,
            ${radius}
          )
        `),
        order: [[sequelize.literal('distance'), 'ASC']],
        limit: 50,
      });

      return nearbySignals;
    } catch (error) {
      throw error;
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
      throw boom.internal('Error creating signal');
    }
  }
}

export default new SignalService();
