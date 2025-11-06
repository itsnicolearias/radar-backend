import request from "supertest";
import app from "../../../app";
import { sequelize } from "../../../models";
import { faker } from "@faker-js/faker";
import { Subscription, SubscriptionPlan, User } from "../../../models";

describe("Event API", () => {
  let freeUserToken: string;
  let premiumUserToken: string;
  let premiumUser: User;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: "password123",
    };
    await request(app).post("/api/auth/register").send(userData);
    const freeUserLogin = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    freeUserToken = freeUserLogin.body.token;

    const premiumUserData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: "password123",
    };

    const premiumUserRes = await request(app).post("/api/auth/register").send(premiumUserData);
    premiumUser = premiumUserRes.body.user;
    const premiumPlan = await SubscriptionPlan.create({
      name: "Radar Plus",
      price: 10,
      features: {},
      isActive: true,
    });
    await Subscription.create({
      userId: premiumUser.userId,
      planId: premiumPlan.subscriptionPlanId,
      status: "active",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });
    const premiumUserLogin = await request(app).post("/api/auth/login").send({
      email: premiumUserData.email,
      password: premiumUserData.password,
    });
    premiumUserToken = premiumUserLogin.body.token;
  });

  it("should not create a new event for a free user", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${freeUserToken}`)
      .send({
        title: "Test Event",
        startDate: new Date(),
      });
    expect(res.status).toBe(403);
  });

  it("should create a new event for a premium user", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Test Event",
        startDate: new Date(),
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Test Event");
  });

  it("should get all events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(res.body.rows.length).toBe(1);
  });

  it("should get an event by id", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Another Test Event",
        startDate: new Date(),
      });
    const res = await request(app).get(`/api/events/${event.body.eventId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Another Test Event");
  });

  it("should update an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Event to Update",
        startDate: new Date(),
      });
    const res = await request(app)
      .put(`/api/events/${event.body.eventId}`)
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Updated Event",
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Event");
  });

  it("should delete an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Event to Delete",
        startDate: new Date(),
      });
    const res = await request(app)
      .delete(`/api/events/${event.body.eventId}`)
      .set("Authorization", `Bearer ${premiumUserToken}`);
    expect(res.status).toBe(204);
  });

  it("should add interest to an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Interest Event",
        startDate: new Date(),
      });
    const res = await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${premiumUserToken}`);
    expect(res.status).toBe(204);
  });

  it("should remove interest from an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Interest Event to Remove",
        startDate: new Date(),
      });
    await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${premiumUserToken}`);
    const res = await request(app)
      .delete(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${premiumUserToken}`);
    expect(res.status).toBe(204);
  });

  it("should get all interested users for an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${premiumUserToken}`)
      .send({
        title: "Event with Interested Users",
        startDate: new Date(),
      });
    await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${premiumUserToken}`);
    const res = await request(app).get(
      `/api/events/${event.body.eventId}/interest`
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  describe("POST /events/:eventId/boost", () => {
    it("should not allow a free user to boost an event", async () => {
      const event = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${premiumUserToken}`)
        .send({
          title: "Event to Boost",
          startDate: new Date(),
        });
      const res = await request(app)
        .post(`/api/events/${event.body.eventId}/boost`)
        .set("Authorization", `Bearer ${freeUserToken}`);
      expect(res.status).toBe(403);
    });

    it("should allow a premium user to boost an event", async () => {
      const event = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${premiumUserToken}`)
        .send({
          title: "Event to Boost",
          startDate: new Date(),
        });
      const res = await request(app)
        .post(`/api/events/${event.body.eventId}/boost`)
        .set("Authorization", `Bearer ${premiumUserToken}`);
      expect(res.status).toBe(200);
      expect(res.body.isBoosted).toBe(true);
    });

    it("should show boosted events first", async () => {
      await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${premiumUserToken}`)
        .send({
          title: "Normal Event 1",
          startDate: new Date(),
        });
      const eventToBoost = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${premiumUserToken}`)
        .send({
          title: "Event to Boost",
          startDate: new Date(),
        });
      await request(app)
        .post(`/api/events/${eventToBoost.body.eventId}/boost`)
        .set("Authorization", `Bearer ${premiumUserToken}`);

      const res = await request(app).get("/api/events");
      expect(res.status).toBe(200);
      expect(res.body.rows[0].isBoosted).toBe(true);
    });
  });
});
