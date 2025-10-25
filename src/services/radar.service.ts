import { User, Profile } from "../models"
import sequelize from "../config/sequelize"
import type { GetNearbyUsersInput } from "../schemas/radar.schema"
import { Op } from "sequelize"

export const getNearbyUsers = async (userId: string, data: GetNearbyUsersInput) => {
  try {
    const { latitude, longitude, radius } = data

    // Only include users who are verified, visible, and not in invisible mode
    const nearbyUsers = await User.findAll({
      where: {
        userId: { [Op.ne]: userId },
        isVerified: true,
        isVisible: true,
        invisibleMode: false,
        lastLatitude: { [Op.ne]: null },
        lastLongitude: { [Op.ne]: null },
      },
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["photoUrl", "bio", "age", "interests"],
        },
      ],
      attributes: {
        exclude: ["passwordHash", "emailVerificationToken"],
        include: [
          [
            sequelize.literal(`
              ST_Distance(
                ST_MakePoint(${longitude}, ${latitude})::geography,
                ST_MakePoint(last_longitude, last_latitude)::geography
              )
            `),
            "distance",
          ],
        ],
      },
      having: sequelize.literal(`
        ST_DWithin(
          ST_MakePoint(${longitude}, ${latitude})::geography,
          ST_MakePoint(last_longitude, last_latitude)::geography,
          ${radius}
        )
      `),
      order: [[sequelize.literal("distance"), "ASC"]],
      limit: 50,
    })

    return nearbyUsers
  } catch (error) {
    throw error
  }
}
