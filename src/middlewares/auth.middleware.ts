import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"
import { unauthorized } from "../utils/errors"
import { Subscription } from "../models";

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    subscriptionStatus: "free" | "premium"
  }
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw unauthorized("No token provided")
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token) as { userId: string, email: string }

    const subscription = await Subscription.findOne({
      where: { userId: decoded.userId, status: "active" },
    });

    req.user = {
      ...decoded,
      subscriptionStatus: subscription ? "premium" : "free",
    };

    next()
  } catch (error) {
    next(unauthorized(error))
  }
}
