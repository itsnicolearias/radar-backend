import request from "supertest";
import app from "../app";
import { faker } from "@faker-js/faker";
import sequelize from "../config/sequelize";

describe.skip("Event API", () => {
  let token: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: "password123",
    };
    await request(app).post("/api/auth/register").send(userData);
    //const user = registerRes.body.user;
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });
    token = loginRes.body.token;
  });

  it("should create a new event", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Event to Update",
        startDate: new Date(),
      });
    const res = await request(app)
      .put(`/api/events/${event.body.eventId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Event",
      });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Event");
  });

  it("should delete an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Event to Delete",
        startDate: new Date(),
      });
    const res = await request(app)
      .delete(`/api/events/${event.body.eventId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("should add interest to an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Interest Event",
        startDate: new Date(),
      });
    const res = await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("should remove interest from an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Interest Event to Remove",
        startDate: new Date(),
      });
    await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app)
      .delete(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("should get all interested users for an event", async () => {
    const event = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Event with Interested Users",
        startDate: new Date(),
      });
    await request(app)
      .post(`/api/events/${event.body.eventId}/interest`)
      .set("Authorization", `Bearer ${token}`);
    const res = await request(app).get(
      `/api/events/${event.body.eventId}/interest`
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
