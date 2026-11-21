import Boom from "@hapi/boom"
import { Transaction } from "sequelize"
import Profile from "../models/profile.model"
import { sequelize } from "../models"
import type { PhotoStorageProvider } from "../interfaces/profile.interface"
import { config } from "../config/config"
import { deleteCloudinaryImage, uploadImageToCloudinary } from "./image-storage/cloudinary.provider"
import { validateProfileImage } from "./image-storage/image-validation"
import { deleteS3ProfileImage } from "./image-storage/s3.provider"
import logger from "../utils/logger"

const getSelectedProvider = (): PhotoStorageProvider => {
  if (config.imageStorageProvider === "cloudinary" || config.imageStorageProvider === "s3") {
    return config.imageStorageProvider
  }
  throw Boom.badData("IMAGE_STORAGE_PROVIDER must be either cloudinary or s3.")
}

export const updateProfileImage = async (userId: string, buffer: Buffer, mimeType: string) => {
  const provider = getSelectedProvider()
  if (provider !== "cloudinary") {
    throw Boom.conflict("Profile image uploads use the existing S3 signed-URL flow when IMAGE_STORAGE_PROVIDER=s3.")
  }
  validateProfileImage(buffer, mimeType)

  const profile = await Profile.findOne({ where: { userId } })
  if (!profile) {
    throw Boom.notFound("Profile not found.")
  }

  const storedImage = await uploadImageToCloudinary(buffer, mimeType, userId)
  const previous = {
    url: profile.photoUrl,
    provider: profile.photoStorageProvider,
    publicId: profile.cloudinaryPublicId,
  }

  const transaction: Transaction = await sequelize.transaction()
  try {
    await profile.update(
      {
        photoUrl: storedImage.secureUrl,
        photoStorageProvider: "cloudinary",
        cloudinaryPublicId: storedImage.publicId,
      },
      { transaction },
    )
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    try {
      await deleteCloudinaryImage(storedImage.publicId, userId)
    } catch (cleanupError) {
      logger.error("Failed to clean up uploaded Cloudinary profile image after database update failure", cleanupError)
    }
    throw error
  }

  let cleanupWarning: string | undefined
  try {
    if (previous.provider === "cloudinary" && previous.publicId) {
      await deleteCloudinaryImage(previous.publicId, userId)
    } else if (
      (previous.provider === "s3" || (!previous.provider && previous.url)) &&
      previous.url
    ) {
      await deleteS3ProfileImage(previous.url, userId)
    }
  } catch (error) {
    logger.error("Failed to delete previous profile image after replacement", error)
    cleanupWarning = "The new profile image was saved, but the previous image could not be removed."
  }

  return { profile, cleanupWarning }
}

export const getImageStorageProvider = getSelectedProvider
