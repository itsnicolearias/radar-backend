import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv"

dotenv.config()

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const bucketName = process.env.AWS_S3_BUCKET || "radar-uploads"

export interface UploadFileOptions {
  key: string
  body: Buffer
  contentType: string
}

export const uploadFile = async (options: UploadFileOptions): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    })

    await s3Client.send(command)
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${options.key}`
  } catch (error) {
    console.error("Error uploading file to S3:", error)
    throw error
  }
}

export const deleteFile = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    console.error("Error deleting file from S3:", error)
    throw error
  }
}

export const getFile = async (key: string): Promise<Buffer> => {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const response = await s3Client.send(command)
    const stream = response.Body as any
    const chunks: Buffer[] = []

    return new Promise((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk))
      stream.on("error", reject)
      stream.on("end", () => resolve(Buffer.concat(chunks)))
    })
  } catch (error) {
    console.error("Error getting file from S3:", error)
    throw error
  }
}

export default s3Client
