import request from 'supertest';
import app from '../app';
import { User } from '../models';
import { generateToken } from '../utils/jwt';
import * as notificationService from '../services/notification.service';

jest.mock('../services/notification.service');

describe('Message Endpoints', () => {
  let user1: User;
  let user2: User;
  let token1: string;

  beforeAll(async () => {
    user1 = await User.create({
      firstName: 'Test',
      lastName: 'User1',
      email: 'test.user1@example.com',
      passwordHash: 'password',
    });
    user2 = await User.create({
      firstName: 'Test',
      lastName: 'User2',
      email: 'test.user2@example.com',
      passwordHash: 'password',
    });
    token1 = generateToken({ userId: user1.userId, email: user1.email, firstName: user1.firstName });
  });

  afterAll(async () => {
    await user1.destroy();
    await user2.destroy();
  });

  describe('POST /messages', () => {
    it('should send a message and trigger a notification', async () => {
      const res = await request(app)
        .post('/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({ receiverId: user2.userId, content: 'Hello' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty('content', 'Hello');
      expect(notificationService.sendNewMessageNotification).toHaveBeenCalledWith(user2.userId, user1.firstName);
    });
  });
});
