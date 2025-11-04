import { User, Profile } from "../models"
import sequelize, { Op } from "sequelize"
import type { GetNearbyUsersInput } from "../schemas/radar.schema"
import { Op } from "sequelize"
import { badRequest } from "@hapi/boom"

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
          as: "Profile",
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
    throw badRequest(error);
  }
}
