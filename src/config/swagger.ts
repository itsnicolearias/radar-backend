import swaggerJsdoc from "swagger-jsdoc"
import { config } from "./config"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Radar API Documentation",
      version: "1.0.0",
      description: "API documentation for Radar social networking backend",
      contact: {
        name: "Radar Team",
        email: "support@radar.com",
      },
    },
    servers: [
      {
        url: config.isProd ? "https://api.radar.com" : `http://localhost:${config.port}`,
        description: config.isProd ? "Production server" : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              format: "uuid",
            },
            firstName: {
              type: "string",
            },
            lastName: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            isVerified: {
              type: "boolean",
            },
            invisibleMode: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Profile: {
          type: "object",
          properties: {
            profileId: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            bio: {
              type: "string",
              nullable: true,
            },
            age: {
              type: "integer",
              nullable: true,
            },
            country: {
              type: "string",
              nullable: true,
            },
            province: {
              type: "string",
              nullable: true,
            },
            photoUrl: {
              type: "string",
              nullable: true,
            },
            interests: {
              type: "array",
              items: {
                type: "string",
              },
            },
            showAge: {
              type: "boolean",
            },
            showLocation: {
              type: "boolean",
            },
            distanceRadius: {
              type: "integer",
            },
          },
        },
        Connection: {
          type: "object",
          properties: {
            connectionId: {
              type: "string",
              format: "uuid",
            },
            senderId: {
              type: "string",
              format: "uuid",
            },
            receiverId: {
              type: "string",
              format: "uuid",
            },
            status: {
              type: "string",
              enum: ["pending", "accepted", "rejected"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            messageId: {
              type: "string",
              format: "uuid",
            },
            senderId: {
              type: "string",
              format: "uuid",
            },
            receiverId: {
              type: "string",
              format: "uuid",
            },
            content: {
              type: "string",
            },
            isRead: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            notificationId: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            type: {
              type: "string",
              enum: ["message", "connection_request", "connection_accept"],
            },
            message: {
              type: "string",
            },
            isRead: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        NotificationToken: {
          type: "object",
          properties: {
            token: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
