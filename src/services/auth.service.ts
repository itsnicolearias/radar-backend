import bcrypt from "bcrypt"
import crypto from "crypto"
import { generateToken } from "../utils/jwt"
import { unauthorized, conflict, notFound } from "../utils/errors"
import { sendEmail } from "../config/email"
import { config } from "../config/config"
import type { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema"
import { badRequest } from "@hapi/boom"
import User from "../models/user.model"
import { Profile, Subscription, SubscriptionPlan } from "../models"
import type { IAuthResponse, IResendVerificationEmailResponse, IVerifyEmailResponse } from "../interfaces/auth.interface"

export const registerUser = async (data: RegisterUserInput): Promise<IAuthResponse> => {
  try {
    const existingUser = await User.findOne({ where: { email: data.email } })

    if (existingUser) {
      throw conflict("Email already registered")
    }


    const passwordHash = await bcrypt.hash(data.password, 10)
    
    const emailVerificationToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex");

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      emailVerificationToken: hashedToken,
      isVerified: false,
      invisibleMode: false,
      isVisible: false,
    })

    await Profile.create({
      userId: user.userId,
    })

    const freePlan = await SubscriptionPlan.findOne({ where: { name: "Free" } });
    if (!freePlan) {
      throw badRequest("Free subscription plan not found. Please seed the database.");
    }

    await Subscription.create({
      userId: user.userId,
      planId: freePlan.subscriptionPlanId,
      status: "active",
      startDate: new Date(),
      endDate: new Date("9999-12-31"),
    });

    const token = generateToken({
      userId: user.userId,
      email: user.email,
    })

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
    throw badRequest(error);
  }
}

export const resendVerificationEmail = async (email: string): Promise<IResendVerificationEmailResponse> => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw notFound('User not found');
    }

    if (user.isVerified) {
      throw badRequest('Email already verified');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(emailVerificationToken)
      .digest('hex');

    await user.update({
      emailVerificationToken: hashedToken,
    });

    const verificationUrl = `${
      config.clientUrl || 'http://localhost:3000'
    }/verify-email/${emailVerificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Radar - Verify Your Email',
      html: `
        <h1>Welcome ${user.firstName}!</h1>
        <p>Thank you for registering with Radar.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>Or copy and paste this link: ${verificationUrl}</p>
      `,
    });

    return { message: 'Verification email sent' };
  } catch (error) {
    throw badRequest(error);
  }
};

export const loginUser = async (data: LoginUserInput): Promise<IAuthResponse> => {
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
    throw badRequest(error);
  }
}

export const verifyEmail = async (token: string): Promise<IVerifyEmailResponse> => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ where: { emailVerificationToken: hashedToken } })

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
    throw badRequest(error);
  }
}
