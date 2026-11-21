import type { Request, Response, NextFunction } from "express"
import multer from "multer"
import Boom from "@hapi/boom"
import { MAX_PROFILE_IMAGE_SIZE, validateProfileImage } from "../services/image-storage/image-validation"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PROFILE_IMAGE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      callback(Boom.badRequest("Only JPEG, PNG, and WebP files are allowed."))
      return
    }
    callback(null, true)
  },
})

export const receiveProfileImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single("image")(req, res, (error: unknown) => {
    if (error) {
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        return next(Boom.entityTooLarge("Profile images must not exceed 5 MB."))
      }
      return next(error)
    }

    if (!req.file) {
      return next(Boom.badRequest("An image file is required in the 'image' field."))
    }

    try {
      validateProfileImage(req.file.buffer, req.file.mimetype)
      next()
    } catch (validationError) {
      next(validationError)
    }
  })
}
