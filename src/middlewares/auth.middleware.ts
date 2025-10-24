import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { unauthorized } from "../utils/errors"

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw unauthorized("No token provided")
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    req.user = decoded
    next()
  } catch (error) {
    next(unauthorized("Invalid or expired token"))
  }
}
