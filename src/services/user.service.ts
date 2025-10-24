import { User, Profile } from "../models"
import { notFound } from "../utils/errors"
import type { UpdateLocationInput, UpdateUserInput } from "../schemas/user.schema"

export const getUserById = async (userId: string) => {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Profile,
          as: "profile",
        },
      ],
      attributes: { exclude: ["passwordHash"] },
    })

    if (!user) {
      throw notFound("User not found")
    }

    return user
  } catch (error) {
    throw error
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
    throw error
  }
}

export const updateUser = async (userId: string, data: UpdateUserInput) => {
  try {
    const user = await User.findByPk(userId)

    if (!user) {
      throw notFound("User not found")
    }

    await user.update(data)

    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      invisibleMode: user.invisibleMode,
    }
  } catch (error) {
    throw error
  }
}
