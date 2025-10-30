import request from 'supertest';
import app from '../app';
import { User, Message } from '../models';
import { beforeAll, afterAll, afterEach } from './setup';

describe('GET /api/messages', () => {
  let user1: User;
  let user2: User;
  let user3: User;
  let token1: string;
  let adminToken: string;

  beforeAll(async () => {
    await beforeAll();
  });

  afterAll(async () => {
    await afterAll();
  });

  afterEach(async () => {
    await afterEach();
  });

  beforeEach(async () => {
    // Create users
    const res1 = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User1',
      email: 'test1@example.com',
      password: 'password',
    });
    user1 = res1.body.data.user;
    token1 = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User2',
      email: 'test2@example.com',
      password: 'password',
    });
    user2 = res2.body.data.user;

    const res3 = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User3',
      email: 'test3@example.com',
      password: 'password',
    });
    user3 = res3.body.data.user;

    // Make user3 an admin
    await User.update({ roles: ['admin'] }, { where: { userId: user3.userId } });
    const adminRes = await request(app).post('/api/auth/login').send({
      email: 'test3@example.com',
      password: 'password',
    });
    adminToken = adminRes.body.data.token;

    // Create messages
    await Message.create({
      senderId: user1.userId,
      receiverId: user2.userId,
      content: 'Hello',
    });
    await Message.create({
      senderId: user2.userId,
      receiverId: user1.userId,
      content: 'Hi there',
    });
    await Message.create({
      senderId: user1.userId,
      receiverId: user3.userId,
      content: 'Good morning',
    });
  });

  afterAll(afterAll);

  afterEach(afterEach);

  it('should return recent conversations', async () => {
    const res = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversations).toHaveLength(2);
    expect(res.body.data.conversations[0].user.userId).toBe(user3.userId);
    expect(res.body.data.conversations[0].lastMessage.content).toBe('Good morning');
    expect(res.body.data.conversations[1].user.userId).toBe(user2.userId);
    expect(res.body.data.conversations[1].lastMessage.content).toBe('Hi there');
  });

  it('should return paginated conversations', async () => {
    const res = await request(app)
      .get('/api/messages?page=1&limit=1')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversations).toHaveLength(1);
    expect(res.body.data.conversations[0].user.userId).toBe(user3.userId);
  });

  it('should return all conversations if user is admin and all=true', async () => {
    const res = await request(app)
      .get('/api/messages?all=true')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversations).toHaveLength(2);
  });

  it('should ignore all=true if user is not admin', async () => {
    const res = await request(app)
      .get('/api/messages?all=true')
      .set('Authorization', `Bearer ${token1}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.conversations).toHaveLength(2);
  });
});
