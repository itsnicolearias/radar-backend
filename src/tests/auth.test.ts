import request from 'supertest';
import app from '../app';
import { beforeAll, afterAll, afterEach } from './setup';
import { User } from '../models';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await beforeAll();
  });

  afterAll(async () => {
    await afterAll();
  });

  afterEach(async () => {
    await afterEach();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "SecurePass123!",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("user")
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data.user.email).toBe(userData.email)
      expect(response.body.data.user.firstName).toBe(userData.firstName)
      expect(response.body.data.user).not.toHaveProperty("passwordHash")
    })

    it("should fail with invalid email", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "SecurePass123!",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
    })

    it("should fail with missing required fields", async () => {
      const userData = {
        firstName: "John",
        email: "john.doe@example.com",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
    })

    it("should fail with duplicate email", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "SecurePass123!",
      }

      await request(app).post("/api/auth/register").send(userData).expect(201)

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "SecurePass123!",
      }
      await request(app).post("/api/auth/register").send(userData)
    })
  });

  describe('POST /api/auth/resend-verification', () => {
    beforeEach(async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
      };
      await request(app).post('/api/auth/register').send(userData);
    });

    it('should resend verification email successfully', async () => {
      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'john.doe@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toBe('Verification email sent');
    });

    it('should fail if email is already verified', async () => {
      // First, verify the email
      const user = await User.findOne({ where: { email: 'john.doe@example.com' } });
      if (user && user.emailVerificationToken) {
        const token = user.emailVerificationToken;
        await request(app).get(`/api/auth/verify-email/${token}`);
      }

      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'john.doe@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if user is not found', async () => {
      const res = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'notfound@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should trigger rate limiter', async () => {
      const agent = request.agent(app);
      for (let i = 0; i < 5; i++) {
        await agent
          .post('/api/auth/resend-verification')
          .send({ email: 'john.doe@example.com' });
      }

      const res = await agent
        .post('/api/auth/resend-verification')
        .send({ email: 'john.doe@example.com' });

      expect(res.status).toBe(429);
    });
  });

  it('should login successfully with correct credentials', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
    };

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("user")
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data.user.email).toBe(loginData.email)
    })

    it("should fail with incorrect password", async () => {
      const loginData = {
        email: "john.doe@example.com",
        password: "WrongPassword123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body.success).toBe(false)
    })

    it("should fail with non-existent email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "SecurePass123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(404)

      expect(response.body.success).toBe(false)
    })
  })
