import dotenv from "dotenv"

dotenv.config()

export const config = {
  env: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number.parseInt(process.env.PORT || "3000"),

  // Database
  dbUrl: process.env.DATABASE_URL || "",
  dbUser: process.env.DB_USER || "postgres",
  dbPassword: process.env.DB_PASSWORD || "postgres",
  dbName: process.env.DB_NAME || "radar_db",
  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number.parseInt(process.env.DB_PORT || "5432"),

  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // AWS S3
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  awsS3Bucket: process.env.AWS_S3_BUCKET || "radar-uploads",

  // Redis
  redisUrl: process.env.REDIS_URL || "",

  // Email
  emailHost: process.env.EMAIL_HOST || "smtp.gmail.com",
  emailPort: Number.parseInt(process.env.EMAIL_PORT || "587"),
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASS || "",
  emailFrom: process.env.EMAIL_FROM || "noreply@radar.com",
}
