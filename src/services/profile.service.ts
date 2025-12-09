import { notFound } from "../utils/errors"
import type { UpdateProfileInput } from "../schemas/profile.schema"
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
          attributes: ["userId", "firstName", "lastName", "email", "displayName"],
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



import sequelize from '../config/sequelize';

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction: t });
    const profile = await Profile.findOne({ where: { userId }, transaction: t });

    if (!profile || !user) {
      throw notFound("Profile or user not found");
    }

    // Separate user and profile data
    const { firstName, lastName, displayName, birthDate, invisibleMode, ...profileData } = data;
    const userData = {
      firstName,
      lastName,
      displayName,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      invisibleMode,
    };

    // Update profile
    await profile.update(profileData, { transaction: t });

    // Update user
    await user.update(userData, { transaction: t });

    await t.commit();

    return {
      profile,
      user,
    };
  } catch (error) {
    await t.rollback();
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
