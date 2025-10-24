import { User, Profile } from "../models"
import { notFound } from "../utils/errors"
import type { UpdateLocationInput, UpdateUserInput, ToggleVisibilityInput } from "../schemas/user.schema"

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

    const updateData: any = { ...data }
    if (data.birthDate) {
      updateData.birthDate = new Date(data.birthDate)
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
    throw error
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
    throw error
  }
}
