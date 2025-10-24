import bcrypt from "bcrypt"
import crypto from "crypto"
import { User, Profile } from "../models"
import { generateToken } from "../utils/jwt"
import { unauthorized, conflict, notFound } from "../utils/errors"
import { sendEmail } from "../config/email"
import { config } from "../config/config"
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema"

export interface AuthResponse {
  token: string
  user: {
    userId: string
    firstName: string
    lastName: string
    email: string
    isVerified: boolean
    displayName: string | null
    birthDate: Date | null
  }
}

export const registerUser = async (data: RegisterUserInput): Promise<AuthResponse> => {
  try {
    const existingUser = await User.findOne({ where: { email: data.email } })

    if (existingUser) {
      throw conflict("Email already registered")
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      emailVerificationToken,
    })

    await Profile.create({
      userId: user.userId,
    })

    const token = generateToken({
      userId: user.userId,
      email: user.email,
    })

    try {
      const verificationUrl = `${config.clientUrl || "http://localhost:3000"}/verify-email/${emailVerificationToken}`
      await sendEmail({
        to: user.email,
        subject: "Welcome to Radar - Verify Your Email",
        html: `
          <h1>Welcome ${user.firstName}!</h1>
          <p>Thank you for registering with Radar.</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>Or copy and paste this link: ${verificationUrl}</p>
        `,
      })
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
    }

    return {
      token,
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        displayName: user.displayName,
        birthDate: user.birthDate,
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
        displayName: user.displayName,
        birthDate: user.birthDate,
      },
    }
  } catch (error) {
    throw error
  }
}

export const verifyEmail = async (token: string): Promise<{ message: string; user: AuthResponse["user"] }> => {
  try {
    const user = await User.findOne({ where: { emailVerificationToken: token } })

    if (!user) {
      throw notFound("Invalid or expired verification token")
    }

    if (user.isVerified) {
      return {
        message: "Email already verified",
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isVerified: user.isVerified,
          displayName: user.displayName,
          birthDate: user.birthDate,
        },
      }
    }

    const shouldBeVisible = user.displayName !== null && user.displayName.trim() !== ""

    await user.update({
      isVerified: true,
      emailVerificationToken: null,
      isVisible: shouldBeVisible,
    })

    return {
      message: "Email verified successfully",
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        displayName: user.displayName,
        birthDate: user.birthDate,
      },
    }
  } catch (error) {
    throw error
  }
}
