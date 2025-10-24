import type { Response, NextFunction } from "express"
import type { AuthRequest } from "../middlewares/auth.middleware"
import * as userService from "../services/user.service"
import type { UpdateLocationInput, UpdateUserInput, ToggleVisibilityInput } from "../schemas/user.schema"

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const user = await userService.getUserById(id)

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
    const { id } = req.params
    const data: UpdateLocationInput = req.body

    if (req.user?.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const result = await userService.updateUserLocation(id, data)

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
    const { id } = req.params
    const data: UpdateUserInput = req.body

    if (req.user?.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const result = await userService.updateUser(id, data)

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
    const { id } = req.params
    const data: ToggleVisibilityInput = req.body

    if (req.user?.userId !== id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      })
    }

    const result = await userService.toggleVisibility(id, data)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}
