import { notFound } from "../utils/errors"
import type { CreateProfileInput, UpdateProfileInput } from "../schemas/profile.schema"
import { badRequest } from "@hapi/boom"
import Profile from "../models/profile.model"
import User from "../models/user.model"
import type { IProfileResponse } from "../interfaces/profile.interface"

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

    return {
      profileId: profile.profileId,
      userId: profile.userId,
      photoUrl: profile.photoUrl,
      bio: profile.bio,
      location: null, // missing in model
      website: null, // missing in model
      birthDate: null, // missing in model
      gender: null, // missing in model
      pronouns: null, // missing in model
      height: null, // missing in model
      zodiac: null, // missing in model
      education: null, // missing in model
      work: null, // missing in model
      interests: profile.interests,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      User: profile.User,
    };
  } catch (error) {
    throw badRequest(error);
  }
}

export const createProfile = async (userId: string, data: CreateProfileInput): Promise<IProfileResponse> => {
  try {
    const existingProfile = await Profile.findOne({ where: { userId } })

    if (existingProfile) {
      return updateProfile(userId, data)
    }

    const profile = await Profile.create({
      userId,
      ...data,
    })

    return {
      profileId: profile.profileId,
      userId: profile.userId,
      photoUrl: profile.photoUrl,
      bio: profile.bio,
      location: null, // missing in model
      website: null, // missing in model
      birthDate: null, // missing in model
      gender: null, // missing in model
      pronouns: null, // missing in model
      height: null, // missing in model
      zodiac: null, // missing in model
      education: null, // missing in model
      work: null, // missing in model
      interests: profile.interests,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      User: profile.User,
    };
  } catch (error) {
    throw badRequest(error);
  }
}

export const updateProfile = async (userId: string, data: UpdateProfileInput): Promise<IProfileResponse> => {
  try {
    const profile = await Profile.findOne({ where: { userId } })

    if (!profile) {
      throw notFound("Profile not found")
    }

    await profile.update(data)

    return {
      profileId: profile.profileId,
      userId: profile.userId,
      photoUrl: profile.photoUrl,
      bio: profile.bio,
      location: null, // missing in model
      website: null, // missing in model
      birthDate: null, // missing in model
      gender: null, // missing in model
      pronouns: null, // missing in model
      height: null, // missing in model
      zodiac: null, // missing in model
      education: null, // missing in model
      work: null, // missing in model
      interests: profile.interests,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      User: profile.User,
    };
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
