import bcrypt from "bcrypt"
import { User, Profile } from "../models"
import { generateToken } from "../utils/jwt"
import { unauthorized, conflict } from "../utils/errors"
import { sendEmail } from "../config/email"
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema"

export interface AuthResponse {
  token: string
  user: {
    userId: string
    firstName: string
    lastName: string
    email: string
    isVerified: boolean
  }
}

export const registerUser = async (data: RegisterUserInput): Promise<AuthResponse> => {
  try {
    const existingUser = await User.findOne({ where: { email: data.email } })

    if (existingUser) {
      throw conflict("Email already registered")
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    })

    await Profile.create({
      userId: user.userId,
    })

    const token = generateToken({
      userId: user.userId,
      email: user.email,
    })

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Radar!",
        html: `
          <h1>Welcome ${user.firstName}!</h1>
          <p>Thank you for registering with Radar.</p>
          <p>Please verify your email to get started.</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
    }

    return {
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
    }
  } catch (error) {
    throw error
  }
}

export const loginUser = async (data: LoginUserInput): Promise<AuthResponse> => {
  try {
    const user = await User.findOne({ where: { email: data.email } })

    if (!user) {
      throw unauthorized("Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

    if (!isPasswordValid) {
      throw unauthorized("Invalid email or password")
    }

    await user.update({ lastSeenAt: new Date() })

    const token = generateToken({
      userId: user.userId,
      email: user.email,
    })

    return {
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
    }
  } catch (error) {
    throw error
  }
}
