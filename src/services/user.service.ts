import { badRequest, notFound } from "../utils/errors"
import type { UpdateLocationInput, UpdateUserInput, ToggleVisibilityInput } from "../schemas/user.schema"
import Profile from "../models/profile.model"
import User from "../models/user.model"
import type {
  IUserResponse,
} from "../interfaces/user.interface"

export const getUserById = async (userId: string): Promise<IUserResponse> => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Profile,
          as: "Profile",
        },
      ],
      attributes: { exclude: ["passwordHash"] },
    })

    if (!user) {
      throw notFound("User not found")
    }

    return user as unknown as IUserResponse;
  } catch (error) {
    throw badRequest(error);
  }
}

export const updateUserLocation = async (userId: string, data: UpdateLocationInput) => {
  try {
    const user = await User.findByPk(userId)

    if (!user) {
      throw notFound("User not found")
    }

    await user.update({
      lastLatitude: data.latitude,
      lastLongitude: data.longitude,
      lastSeenAt: new Date(),
    })

    return {
      userId: user.userId,
      latitude: user.lastLatitude,
      longitude: user.lastLongitude,
      lastSeenAt: user.lastSeenAt,
    }
  } catch (error) {
    throw badRequest(error);
  }
}

export const updateUser = async (userId: string, data: UpdateUserInput) => {
  try {
    const user = await User.findByPk(userId)

    if (!user) {
      throw notFound("User not found")
    }

    const updateData: Partial<UpdateUserInput> = { ...data }
    if (data.birthDate) {
      updateData.birthDate = data.birthDate;
    }

    await user.update(updateData)

    if (user.isVerified && user.displayName && !user.isVisible) {
      await user.update({ isVisible: true })
    }

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      displayName: user.displayName,
      birthDate: user.birthDate,
      invisibleMode: user.invisibleMode,
      isVisible: user.isVisible,
    }
  } catch (error) {
    throw badRequest(error);
  }
}

export const toggleVisibility = async (userId: string, data: ToggleVisibilityInput) => {
  try {
    const user = await User.findByPk(userId)

    if (!user) {
      throw notFound("User not found")
    }

    await user.update({ isVisible: data.isVisible })

    return {
      userId: user.userId,
      isVisible: user.isVisible,
    }
  } catch (error) {
    throw badRequest(error);
  }
}
