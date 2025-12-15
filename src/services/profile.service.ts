import { notFound } from "../utils/errors"
import type { UpdateProfileInput } from "../schemas/profile.schema"
import { badData, badRequest } from "@hapi/boom"
import Profile from "../models/profile.model"
import User from "../models/user.model"
import type { IProfileResponse } from "../interfaces/profile.interface"
import { sequelize } from "../models"

export const getProfileByUserId = async (userId: string): Promise<IProfileResponse> => {
  try {
    const profile = await Profile.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "User",
          attributes: ["userId", "firstName", "lastName", "email", "displayName", "lastLatitude", "lastLongitude", "lastSeenAt", "isVerified", "invisibleMode", "isVisible", "birthDate", "createdAt", "updatedAt"],
        },
      ],
    })

    if (!profile) {
      throw notFound("Profile not found")
    }

    return profile;
  } catch (error) {
    throw badRequest(error);
  }
}



export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  try {
    let userInfo;
    let profileInfo;
    const profile = await Profile.findOne({ where: { userId } })
    const user = await User.findByPk(userId)

    if (!profile || !user) {
      throw notFound("Profile not found")
    }

    const t = await sequelize.transaction();

    try {   
      if (data.Profile){
      await profile.update(data.Profile, { transaction: t })
      profileInfo = await profile.reload();
    }

    if (data.User){
      await user.update(data.User, { transaction: t })
      userInfo = await user.reload();

    }
    await t.commit();
    } catch (error) {
      await t.rollback();
      throw badData(error);
    }

    return {
      Profile: profileInfo,
      User: userInfo,
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
