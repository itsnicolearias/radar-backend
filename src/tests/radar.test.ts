import request from 'supertest';
import app from '../app';
import { User } from '../models';
import { generateToken } from '../utils/jwt';
import * as notificationService from '../services/notification.service';
import * as radarService from '../services/radar.service';

jest.mock('../services/notification.service');
jest.mock('../services/radar.service');

describe('Radar Endpoints', () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      passwordHash: 'password',
    });
    token = generateToken({ userId: user.userId, email: user.email, firstName: user.firstName });
  });

  afterAll(async () => {
    await user.destroy();
  });

  describe('GET /radar/nearby', () => {
    it('should get nearby users and trigger a notification', async () => {
      (radarService.getNearbyUsers as jest.Mock).mockResolvedValue([{ id: 'user2' }]);

      const res = await request(app)
        .get('/radar/nearby?latitude=10&longitude=10')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(notificationService.sendRadarDetectionNotification).toHaveBeenCalledWith(user.userId, 1);
    });
  });
});
