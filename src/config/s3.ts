import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { config } from "./config"
import { badRequest } from "@hapi/boom"

const s3Client = new S3Client({
  region: config.awsRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
})

export interface UploadFileOptions {
  key: string
  body: Buffer
  contentType: string
}

export const uploadFile = async (options: UploadFileOptions): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: config.awsS3Bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    })

    await s3Client.send(command)
    return `https://${config.awsS3Bucket}.s3.${config.awsRegion}.amazonaws.com/${options.key}`
  } catch (error) {
    throw badRequest(error);
  }
}

export const deleteFile = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.awsS3Bucket,
      Key: key,
    })

    await s3Client.send(command)
  } catch (error) {
    throw badRequest(error);
  }
}

export const getFile = async (key: string): Promise<Buffer> => {
  try {
    const command = new GetObjectCommand({
      Bucket: config.awsS3Bucket,
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
    throw badRequest(error);
  }
}

export default s3Client
