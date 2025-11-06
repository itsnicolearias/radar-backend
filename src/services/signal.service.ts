import Signal from '../models/signal.model';
import User from '../models/user.model';
import boom, { badRequest } from '@hapi/boom';

class SignalService {
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
