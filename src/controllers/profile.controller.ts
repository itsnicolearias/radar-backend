import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as profileService from "../services/profile.service"
import type { UpdateProfileInput } from "../schemas/profile.schema"
import * as imageStorageService from "../services/image-storage.service"

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    const profile = await profileService.getProfileByUserId(String(userId))

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}



export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const data: UpdateProfileInput = req.body

    if (req.user?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const profile = await profileService.updateProfile(String(userId), data)

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId

    if (req.user?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const result = await profileService.deleteProfile(String(userId))

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const updateProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    if (!userId || !req.file) {
      return res.status(400).json({ success: false, message: "An authenticated user and image are required." })
    }

    const result = await imageStorageService.updateProfileImage(String(userId), req.file.buffer, req.file.mimetype)
    return res.status(200).json({
      success: true,
      data: {
        photoUrl: result.profile.photoUrl,
        photoStorageProvider: result.profile.photoStorageProvider,
      },
      ...(result.cleanupWarning && { warning: result.cleanupWarning }),
    })
  } catch (error) {
    return next(error)
  }
}
