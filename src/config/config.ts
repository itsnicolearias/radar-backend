import "dotenv/config"

if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
}

export const config = {
  env: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number.parseInt(process.env.PORT!),

  // Database
  dbUrl: process.env.DATABASE_URL || "",
  dbTestUrl: process.env.DATABASE_TEST_URL || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Encryption
  encryptionKey: process.env.ENCRYPTION_KEY || "",

  // AWS S3
  awsRegion: process.env.AWS_REGION || "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  awsS3Bucket: process.env.AWS_S3_BUCKET || "",

  // Redis
  redisUrl: process.env.REDIS_URL || "",

  // Email
  emailHost: process.env.EMAIL_HOST || "",
  emailPort: Number.parseInt(process.env.EMAIL_PORT || ""),
  emailUser: process.env.EMAIL_USER || "",
  emailPass: process.env.EMAIL_PASSWORD || "",
  emailFrom: process.env.EMAIL_FROM || "",

  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
}
