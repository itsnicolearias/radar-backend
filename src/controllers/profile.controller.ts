import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middleware/auth.middleware"
import * as profileService from "../services/profile.service"
import type { CreateProfileInput, UpdateProfileInput } from "../schemas/profile.schema"

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const profile = await profileService.getProfileByUserId(userId)

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const createProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: CreateProfileInput = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const profile = await profileService.createProfile(userId, data)

    res.status(201).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const data: UpdateProfileInput = req.body

    if (req.user?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const profile = await profileService.updateProfile(userId, data)

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params

    if (req.user?.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const result = await profileService.deleteProfile(userId)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
