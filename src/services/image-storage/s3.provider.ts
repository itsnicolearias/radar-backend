import Boom from "@hapi/boom"
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { config } from "../../config/config"

const getProfileImageKey = (imageUrl: string, userId: string): string => {
  let url: URL
  try {
    url = new URL(imageUrl)
  } catch {
    throw Boom.badRequest("Stored S3 image URL is invalid.")
  }

  const expectedHost = `${config.awsS3Bucket}.s3.${config.awsRegion}.amazonaws.com`
  let key: string
  try {
    key = decodeURIComponent(url.pathname.slice(1))
  } catch {
    throw Boom.badRequest("Stored S3 image URL is invalid.")
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== expectedHost ||
    url.search ||
    !key.startsWith(`profiles/${userId}/`) ||
    key.includes("..")
  ) {
    throw Boom.forbidden("The stored image is not an owned S3 profile image.")
  }
  return key
}

export const deleteS3ProfileImage = async (imageUrl: string, userId: string): Promise<void> => {
  if (!config.awsRegion || !config.awsS3Bucket || !config.awsAccessKeyId || !config.awsSecretAccessKey) {
    throw Boom.failedDependency("AWS S3 credentials are not configured.")
  }

  const key = getProfileImageKey(imageUrl, userId)
  const s3 = new S3Client({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  })

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: config.awsS3Bucket, Key: key }))
  } catch {
    throw Boom.badGateway("S3 profile image deletion failed.")
  } finally {
    s3.destroy()
  }
}
