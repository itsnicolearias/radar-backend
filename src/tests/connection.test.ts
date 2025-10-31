import request from "supertest"
import app from "../app"
import "../tests/setup"
import * as notificationService from "../services/notification.service"

jest.mock("../services/notification.service")

describe("Connection Endpoints", () => {
  let user1Token: string
  let user1Id: string
  let user2Token: string
  let user2Id: string

  beforeEach(async () => {
    const user1Data = {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      password: "SecurePass123!",
    }

    const user2Data = {
      firstName: "Bob",
      lastName: "Williams",
      email: "bob@example.com",
      password: "SecurePass123!",
    }

    const user1Response = await request(app).post("/api/auth/register").send(user1Data)
    user1Token = user1Response.body.data.token
    user1Id = user1Response.body.data.user.userId

    const user2Response = await request(app).post("/api/auth/register").send(user2Data)
    user2Token = user2Response.body.data.token
    user2Id = user2Response.body.data.user.userId
  })

  describe("POST /api/connections", () => {
    it("should create a connection request successfully", async () => {
      const connectionData = {
        receiverId: user2Id,
      }

      const response = await request(app)
        .post("/api/connections")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(connectionData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.senderId).toBe(user1Id)
      expect(response.body.data.receiverId).toBe(user2Id)
      expect(response.body.data.status).toBe("pending")
      expect(notificationService.sendConnectionRequestNotification).toHaveBeenCalled()
    })

    it("should fail without authentication", async () => {
      const connectionData = {
        receiverId: user2Id,
      }

      const response = await request(app).post("/api/connections").send(connectionData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("PUT /api/connections/:connectionId", () => {
    let connectionId: string

    beforeEach(async () => {
      const connectionData = {
        receiverId: user2Id,
      }

      const connectionResponse = await request(app)
        .post("/api/connections")
        .set("Authorization", `Bearer ${user1Token}`)
        .send(connectionData)

      connectionId = connectionResponse.body.data.connectionId
    })

    it("should accept a connection request", async () => {
      const updateData = {
        status: "accepted",
      }

      const response = await request(app)
        .put(`/api/connections/${connectionId}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("accepted")
      expect(notificationService.sendConnectionAcceptedNotification).toHaveBeenCalled()
    })

    it("should reject a connection request", async () => {
      const updateData = {
        status: "rejected",
      }

      const response = await request(app)
        .put(`/api/connections/${connectionId}`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe("rejected")
    })
  })
})
