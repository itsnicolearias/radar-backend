import { User, Profile } from "../models"
import sequelize, { Op } from "sequelize"
import type { GetNearbyUsersInput } from "../schemas/radar.schema"
import { badRequest } from "@hapi/boom"
import EventService from "./event.service"
import SignalService from "./signal.service"
import type { IRadarUserResponse } from "../interfaces/radar.interface"

export const getNearbyUsers = async (userId: string, data: GetNearbyUsersInput): Promise<IRadarUserResponse[]> => {
  try {
    const { latitude, longitude, radius } = data

    const nearbyUsers = await User.findAll({
      where: {
        userId: { [Op.ne]: userId },
        isVerified: true,
        isVisible: true,
        invisibleMode: false,
        lastLatitude: { [Op.ne]: null } as unknown as number,
        lastLongitude: { [Op.ne]: null } as unknown as number,
        // Spatial filter using parameterized functions
        [Op.and]: [
          sequelize.where(
            sequelize.fn(
              'ST_DWithin',
              sequelize.cast(
                sequelize.fn('ST_MakePoint', longitude, latitude),
                'geography'
              ),
              sequelize.cast(
                sequelize.fn('ST_MakePoint', sequelize.col('last_longitude'), sequelize.col('last_latitude')),
                'geography'
              ),
              radius
            ),
            true
          )
        ],
      },
      include: [
        {
          model: Profile,
          as: "Profile",
          attributes: ["photoUrl", "bio", "age", "interests", "province", "showAge", "showLocation"],
        },
      ],
      attributes: {
        exclude: ["passwordHash", "emailVerificationToken", "isVerified", "email", "birthDate", "firstName", "lastName"],
        include: [
          [
            sequelize.fn(
              'ST_Distance',
              sequelize.cast(
                sequelize.fn('ST_MakePoint', longitude, latitude),
                'geography'
              ),
              sequelize.cast(
                sequelize.fn('ST_MakePoint', sequelize.col('last_longitude'), sequelize.col('last_latitude')),
                'geography'
              )
            ),
            'distance',
          ],
        ],
      },
      order: [[sequelize.literal('distance'), 'ASC']],
      limit: 50,
    })

    return nearbyUsers as unknown as IRadarUserResponse[];
  } catch (error) {
    throw badRequest(error);
  }
}

export const getNearbyAll = async (userId: string, data: GetNearbyUsersInput) => {
  try {
    const [users, events, signals] = await Promise.all([
      getNearbyUsers(userId, data),
      EventService.getNearbyEvents(data),
      SignalService.getNearbySignals(data),
    ]);

    return {
      users,
      events,
      signals,
    };
  } catch (error) {
    throw badRequest(error);
  }
};
