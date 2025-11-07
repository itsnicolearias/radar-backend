import { notFound } from "../utils/errors"
import type { CreateProfileInput, UpdateProfileInput } from "../schemas/profile.schema"
import { badRequest } from "@hapi/boom"
import Profile from "../models/profile.model"
import User from "../models/user.model"
import type { IProfileResponse, IDeleteProfileResponse } from "../interfaces/profile.interface"

export const getProfileByUserId = async (userId: string): Promise<IProfileResponse> => {
  try {
    const profile = await Profile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstName", "lastName", "email"],
        },
      ],
    })

    if (!profile) {
      throw notFound("Profile not found")
    }

    return profile
  } catch (error) {
    throw badRequest(error);
  }
}

export const createProfile = async (userId: string, data: CreateProfileInput) => {
  try {
    const existingProfile = await Profile.findOne({ where: { userId } })

    if (existingProfile) {
      return updateProfile(userId, data)
    }

    const profile = await Profile.create({
      userId,
      ...data,
    })

    return profile
  } catch (error) {
    throw badRequest(error);
  }
}

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  try {
    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      throw notFound("Profile not found")
    }

    await profile.update(data)

    return profile
  } catch (error) {
    throw badRequest(error);
  }
}

export const deleteProfile = async (userId: string) => {
  try {
    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      throw notFound("Profile not found")
    }

    await profile.destroy()

    return { message: "Profile deleted successfully" }
  } catch (error) {
    throw badRequest(error);
  }
}
