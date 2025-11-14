import jwt from "jsonwebtoken"
import { config } from "../config/config"
import { badRequest } from "@hapi/boom"

export interface JwtPayload {
  userId: string
  email: string
  firstName: string
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
  })
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload
  } catch (error) {
    throw badRequest(error)
  }
}
