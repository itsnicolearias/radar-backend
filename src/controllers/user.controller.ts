import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as userService from "../services/user.service"
import type { UpdateLocationInput, UpdateUserInput, ToggleVisibilityInput } from "../schemas/user.schema"

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const user = await userService.getUserById(String(userId))

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateLocation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const data: UpdateLocationInput = req.body

    const result = await userService.updateUserLocation(String(userId), data)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const data: UpdateUserInput = req.body

    const result = await userService.updateUser(String(userId), data)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const toggleVisibility = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId
    const data: ToggleVisibilityInput = req.body

    const result = await userService.toggleVisibility(String(userId), data)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}
