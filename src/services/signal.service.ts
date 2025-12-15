import Signal from '../models/signal.model';
import User from '../models/user.model';
import { sequelize } from '../models';
import { QueryTypes } from 'sequelize';
import boom, { badRequest } from '@hapi/boom';
import type { ISignalResponse } from '../interfaces/signal.interface';
import { GetNearbyUsersInput } from '../schemas/radar.schema';

class SignalService {
  async getNearbySignals(data: GetNearbyUsersInput): Promise<ISignalResponse[]> {
    try {
      const { latitude, longitude, radius } = data;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const sql = `
        SELECT
          s.signal_id AS "signalId",
          s.sender_id AS "senderId",
          s.note AS "note",
          s.created_at AS "createdAt",
          ST_Distance(
            ST_MakePoint(:lng, :lat)::geography,
            ST_MakePoint(u.last_longitude, u.last_latitude)::geography
          ) AS "distance",
          u.user_id AS "Sender.userId",
          u.display_name AS "Sender.displayName"
        FROM signals s
        JOIN users u ON u.user_id = s.sender_id
        JOIN (
          SELECT sender_id, MAX(created_at) AS max_created_at
          FROM signals
          WHERE created_at >= :since
          GROUP BY sender_id
        ) latest ON latest.sender_id = s.sender_id AND latest.max_created_at = s.created_at
        WHERE ST_DWithin(
          ST_MakePoint(:lng, :lat)::geography,
          ST_MakePoint(u.last_longitude, u.last_latitude)::geography,
          :radius
        )
        ORDER BY s.created_at DESC
        LIMIT 50`;

      const signals = await sequelize.query<ISignalResponse>(sql, {
        replacements: {
          lng: longitude,
          lat: latitude,
          radius,
          since: twentyFourHoursAgo,
        },
        type: QueryTypes.SELECT,
        nest: true,
      });

      return signals;
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
