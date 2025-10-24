import type { Request, Response, NextFunction } from "express"
import * as authService from "../services/auth.service"
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema"

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterUserInput = req.body
    const result = await authService.registerUser(data)

    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginUserInput = req.body
    const result = await authService.loginUser(data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
