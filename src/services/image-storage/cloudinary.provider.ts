import Boom from "@hapi/boom"
import { v2 as cloudinary } from "cloudinary"
import { randomUUID } from "crypto"
import { config } from "../../config/config"

export const CLOUDINARY_PROFILE_FOLDER = "radar/profile-images"

export interface StoredCloudinaryImage {
  secureUrl: string
  publicId: string
}

const configureCloudinary = () => {
  const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = config
  if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
    throw Boom.failedDependency("Cloudinary credentials are not configured.")
  }

  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true,
  })
}

export const uploadImageToCloudinary = async (
  buffer: Buffer,
  mimeType: string,
  userId: string,
): Promise<StoredCloudinaryImage> => {
  configureCloudinary()
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_PROFILE_FOLDER,
      public_id: `profile-${userId}-${randomUUID()}`,
      overwrite: false,
      resource_type: "image",
      allowed_formats: ["jpg", "png", "webp"],
    })

    return { secureUrl: result.secure_url, publicId: result.public_id }
  } catch {
    throw Boom.badGateway("Cloudinary image upload failed.")
  }
}

export const deleteCloudinaryImage = async (publicId: string, userId: string): Promise<void> => {
  const expectedPrefix = `${CLOUDINARY_PROFILE_FOLDER}/profile-${userId}-`
  if (!publicId.startsWith(expectedPrefix)) {
    throw Boom.forbidden("The image does not belong to this user.")
  }

  configureCloudinary()
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Unexpected Cloudinary deletion result: ${result.result}`)
    }
  } catch {
    throw Boom.badGateway("Cloudinary image deletion failed.")
  }
}
