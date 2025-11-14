import request from "supertest"
import app from "../app"
import "../tests/setup"

describe.skip("Profile Endpoints", () => {
  let authToken: string
  let userId: string

  beforeEach(async () => {
    const userData = {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "SecurePass123!",
    }

    const registerResponse = await request(app).post("/api/auth/register").send(userData)
    authToken = registerResponse.body.data.token
    userId = registerResponse.body.data.user.userId
  })

  describe("POST /api/profiles", () => {
    it("should create a profile successfully", async () => {
      const profileData = {
        bio: "Software developer passionate about technology",
        age: 28,
        country: "USA",
        province: "California",
        interests: ["coding", "music", "travel"],
        showAge: true,
        showLocation: true,
        distanceRadius: 5000,
      }

      const response = await request(app)
        .post("/api/profiles")
        .set("Authorization", `Bearer ${authToken}`)
        .send(profileData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.bio).toBe(profileData.bio)
      expect(response.body.data.age).toBe(profileData.age)
      expect(response.body.data.interests).toEqual(profileData.interests)
    })

    it("should fail without authentication", async () => {
      const profileData = {
        bio: "Test bio",
        age: 25,
      }

      const response = await request(app).post("/api/profiles").send(profileData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/profiles/:userId", () => {
    beforeEach(async () => {
      const profileData = {
        bio: "Test bio",
        age: 30,
        country: "Canada",
      }

      await request(app).post("/api/profiles").set("Authorization", `Bearer ${authToken}`).send(profileData)
    })

    it("should get profile by user ID", async () => {
      const response = await request(app)
        .get(`/api/profiles/${userId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.userId).toBe(userId)
      expect(response.body.data.bio).toBe("Test bio")
    })

    it("should fail without authentication", async () => {
      const response = await request(app).get(`/api/profiles/${userId}`).expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
