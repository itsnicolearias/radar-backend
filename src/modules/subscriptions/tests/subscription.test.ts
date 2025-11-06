import request from "supertest";
import app from "../../../app";
import { User } from "../../../models";
import { sign } from "jsonwebtoken";
import { config } from "../../../config/config";
import { Subscription, SubscriptionPlan } from "../../../models";
import { Payment } from "mercadopago";

jest.mock("mercadopago", () => ({
  MercadoPagoConfig: jest.fn().mockImplementation(() => ({})),
  Payment: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
  })),
  Preference: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({
      init_point: "https://mercadopago.com/test",
    }),
  })),
}));

describe("Subscription Module", () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    await SubscriptionPlan.sync({ force: true });
    await SubscriptionPlan.create({
      name: "Radar Plus",
      price: 10,
      features: {},
      isActive: true,
    });

    user = await User.create({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      passwordHash: "password",
    });

    token = sign({ userId: user.userId, email: user.email }, config.jwtSecret, {
      expiresIn: "1h",
    });
  });

  afterAll(async () => {
    await user.destroy();
  });

  describe("POST /subscriptions/create", () => {
    it("should create a Mercado Pago preference", async () => {
      const res = await request(app)
        .post("/api/subscriptions/create")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("init_point");
    });
  });

  describe("POST /webhooks/mercadopago", () => {
    it("should handle a Mercado Pago webhook and upgrade user to premium", async () => {
      const payload = {
        action: "payment.updated",
        data: {
          id: "123456789", // A real payment ID from a test payment
        },
      };

      (Payment.prototype.get as jest.Mock).mockResolvedValue({
        id: "123456789",
        status: "approved",
        external_reference: user.userId,
      });

      const res = await request(app)
        .post("/api/webhooks/mercadopago")
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Webhook received" });

      const subscription = await Subscription.findOne({ where: { userId: user.userId } });
      expect(subscription).not.toBeNull();
      expect(subscription?.status).toBe("active");
    });
  });
});
