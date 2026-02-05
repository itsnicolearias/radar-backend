import request from 'supertest';
import app from '../app';
import { beforeAll as setupBeforeAll, afterAll as setupAfterAll, afterEach as setupAfterEach } from './setup';
import Connection from '../models/connection.model';
import { _ConnectionStatus } from '../interfaces/connection.interface';

describe('Message Soft Delete', () => {
  let user1: any;
  let user2: any;
  let token1: string;
  let token2: string;

  beforeAll(async () => {
    await setupBeforeAll();
  });

  afterAll(async () => {
    await setupAfterAll();
  });

  beforeEach(async () => {
    // Create users
    const res1 = await request(app).post('/api/auth/register').send({
      firstName: 'User',
      lastName: 'One',
      email: 'user1_softdelete@example.com',
      password: 'password123',
    });
    user1 = res1.body.data.user;
    token1 = res1.body.data.token;

    const res2 = await request(app).post('/api/auth/register').send({
      firstName: 'User',
      lastName: 'Two',
      email: 'user2_softdelete@example.com',
      password: 'password123',
    });
    user2 = res2.body.data.user;
    token2 = res2.body.data.token;

    // Create accepted connection
    await Connection.create({
      senderId: user1.userId,
      receiverId: user2.userId,
      status: _ConnectionStatus.ACCEPTED,
    });
  });

  afterEach(async () => {
    await setupAfterEach();
  });

  it('should soft delete an individual message for the user', async () => {
    // Send a message
    const sendRes = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        receiverId: user2.userId,
        content: 'Test message',
      });

    const messageId = sendRes.body.data.messageId;

    // Delete the message for user1
    const deleteRes = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(deleteRes.status).toBe(200);

    // Verify user1 cannot see it
    const getRes1 = await request(app)
      .get(`/api/messages/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(getRes1.body.data.some((m: any) => m.messageId === messageId)).toBe(false);

    // Verify user2 CAN see it
    const getRes2 = await request(app)
      .get(`/api/messages/${user1.userId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(getRes2.body.data.some((m: any) => m.messageId === messageId)).toBe(true);
  });

  it('should soft delete a conversation for the user', async () => {
    // Send multiple messages
    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token1}`)
      .send({ receiverId: user2.userId, content: 'Message 1' });

    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token2}`)
      .send({ receiverId: user1.userId, content: 'Message 2' });

    // Delete conversation for user1
    const deleteConvRes = await request(app)
      .delete(`/api/conversations/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(deleteConvRes.status).toBe(200);

    // Verify user1 sees no messages
    const getRes1 = await request(app)
      .get(`/api/messages/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(getRes1.body.data).toHaveLength(0);

    // Verify conversation is gone from recent list for user1
    const recentRes1 = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token1}`);

    expect(recentRes1.body.data.conversations).toHaveLength(0);

    // Verify user2 still sees all messages
    const getRes2 = await request(app)
      .get(`/api/messages/${user1.userId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(getRes2.body.data).toHaveLength(2);
  });

  it('should reappear when a new message is received after deleting conversation', async () => {
    // Send message and delete conversation
    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token1}`)
      .send({ receiverId: user2.userId, content: 'Old message' });

    await request(app)
      .delete(`/api/conversations/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    // Send NEW message from user2 to user1
    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token2}`)
      .send({ receiverId: user1.userId, content: 'New message' });

    // Verify conversation reappears for user1 with only the new message
    const getRes1 = await request(app)
      .get(`/api/messages/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(getRes1.body.data).toHaveLength(1);
    expect(getRes1.body.data[0].content).toBe('New message');

    const recentRes1 = await request(app)
      .get('/api/messages')
      .set('Authorization', `Bearer ${token1}`);

    expect(recentRes1.body.data.conversations).toHaveLength(1);
    expect(recentRes1.body.data.conversations[0].lastMessage.content).toBe('New message');
  });

  it('should correctly calculate unread count after soft delete', async () => {
    // User 2 sends a message to User 1
    await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${token2}`)
      .send({ receiverId: user1.userId, content: 'Unread message' });

    // Verify unread count is 1 for user1
    const unreadRes1 = await request(app)
      .get('/api/messages/unread/count')
      .set('Authorization', `Bearer ${token1}`);

    expect(unreadRes1.body.data.count).toBe(1);

    // Delete conversation for user1
    await request(app)
      .delete(`/api/conversations/${user2.userId}`)
      .set('Authorization', `Bearer ${token1}`);

    // Verify unread count is now 0 for user1
    const unreadRes2 = await request(app)
      .get('/api/messages/unread/count')
      .set('Authorization', `Bearer ${token1}`);

    expect(unreadRes2.body.data.count).toBe(0);
  });
});
