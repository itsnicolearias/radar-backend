import request from "supertest";
import app from "../app";
import { User } from "../models";
import { generateToken } from "../utils/jwt";

jest.mock("firebase-admin", () => ({
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  messaging: () => ({
    sendToDevice: jest.fn().mockResolvedValue({}),
  }),
}));

describe("Notification Endpoints", () => {
  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create({
      firstName: "Test",
      lastName: "User",
      email: "test.user@example.com",
      passwordHash: "password",
    });
    token = generateToken({ userId: user.userId, email: user.email, firstName: user.firstName });
  });

  afterAll(async () => {
    await user.destroy();
  });

  describe("POST /notifications/token", () => {
    it("should save a new notification token", async () => {
      const res = await request(app)
        .post("/notifications/token")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: "test-token" });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data).toHaveProperty("token", "test-token");
    });
  });

  describe("DELETE /notifications/token", () => {
    it("should delete a notification token", async () => {
      const res = await request(app)
        .delete("/notifications/token")
        .set("Authorization", `Bearer ${token}`)
        .send({ token: "test-token" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toHaveProperty("message", "Token deleted successfully");
    });
  });
});
