import { notFound, badRequest, conflict } from "../utils/errors"
import type { CreateConnectionInput, UpdateConnectionInput } from "../schemas/connection.schema"
import { Op } from "sequelize"
import User from "../models/user.model"
import Connection from "../models/connection.model"
import { _ConnectionStatus, type IConnectionResponse } from "../interfaces/connection.interface"
import { Profile, sequelize } from "../models"
import { getUserById } from "./user.service"

export const createConnection = async (senderId: string, data: CreateConnectionInput): Promise<IConnectionResponse> => {
  try {
    if (senderId === data.receiverId) {
      throw badRequest("Cannot send connection request to yourself")
    }

    const receiver = await User.findByPk(data.receiverId)
    if (!receiver) {
      throw notFound("Receiver not found")
    }

    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId: data.receiverId },
          { senderId: data.receiverId, receiverId: senderId },
        ],
      },
    })

    if (existingConnection) {
      throw conflict("Connection request already exists")
    }

    const connection = await Connection.create({
      senderId,
      receiverId: data.receiverId,
      status: _ConnectionStatus.PENDING,
    })

    return connection
  } catch (error) {
    throw badRequest(error);
  }
}

export const updateConnection = async (connectionId: string, userId: string, data: UpdateConnectionInput) => {
  try {
    const connection = await Connection.findByPk(connectionId)

    if (!connection) {
      throw notFound("Connection not found")
    }

    if (connection.receiverId !== userId) {
      throw badRequest("Only the receiver can update the connection status")
    }

    if (connection.status !== _ConnectionStatus.PENDING) {
      throw badRequest("Connection has already been processed")
    }

    await connection.update({ status: data.status })

    return connection
  } catch (error) {
    throw badRequest(error);
  }
}

export const getConnectionsByUserId = async (userId: string) => {
  try {
    const logguedUser = await getUserById(userId);

    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        [Op.and]: [{status: "accepted"}],
        
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: {
            include: [
              [
                sequelize.literal(`
                  ST_Distance(
                    ST_MakePoint(${logguedUser.lastLongitude}, ${logguedUser.lastLatitude})::geography,
                    ST_MakePoint("Sender"."last_longitude", "Sender"."last_latitude")::geography
                  )
                `),
                "distance", 
              ],
              "userId", "displayName", "email"
            ],
          }, 
          include: [
            {
              model: Profile,
              as: "Profile",
              attributes: ["photoUrl", "bio", "age", "interests", "province", "showAge", "showLocation"],
            },
          ],
        },
        {
          model: User,
          as: "Receiver",
          attributes: {
            include: [
              [
                sequelize.literal(`
                  ST_Distance(
                    ST_MakePoint(${logguedUser.lastLongitude}, ${logguedUser.lastLatitude})::geography,
                    ST_MakePoint("Receiver"."last_longitude", "Receiver"."last_latitude")::geography
                  )
                `),
                "distance", 
              ],
              "userId", "displayName", "email"
            ],
          }, 
          include: [
            {
              model: Profile,
              as: "Profile",
              attributes: ["photoUrl", "bio", "age", "interests", "province", "showAge", "showLocation"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return connections
  } catch (error) {
    throw badRequest(error);
  }
}

export const getPendingConnections = async (userId: string) => {
  try {

    const logguedUser = await getUserById(userId);

    const connections = await Connection.findAll({
      where: {
        receiverId: userId, 
        status: "pending"
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: {
            include: [
              [
                sequelize.literal(`
                  ST_Distance(
                    ST_MakePoint(${logguedUser.lastLongitude}, ${logguedUser.lastLatitude})::geography,
                    ST_MakePoint("Sender"."last_longitude", "Sender"."last_latitude")::geography
                  )
                `),
                "distance", 
              ],
              "userId", "displayName", "email"
            ],
          }, 
          include: [
            {
              model: Profile,
              as: "Profile",
              attributes: ["photoUrl", "bio", "age", "interests", "province", "showAge", "showLocation"],
            },
          ],
        },
        {
          model: User,
          as: "Receiver",
          attributes: {
            include: [
              [
                sequelize.literal(`
                  ST_Distance(
                    ST_MakePoint(${logguedUser.lastLongitude}, ${logguedUser.lastLatitude})::geography,
                    ST_MakePoint("Receiver"."last_longitude", "Receiver"."last_latitude")::geography
                  )
                `),
                "distance", 
              ],
              "userId", "displayName", "email"
            ],
          }, 
          include: [
            {
              model: Profile,
              as: "Profile",
              attributes: ["photoUrl", "bio", "age", "interests", "province", "showAge", "showLocation"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return connections;
  } catch (error) {
    throw badRequest(error);
  }
}

export const deleteConnection = async (connectionId: string, userId: string) => {
  try {
    const connection = await Connection.findByPk(connectionId)

    if (!connection) {
      throw notFound("Connection not found")
    }

    if (connection.senderId !== userId && connection.receiverId !== userId) {
      throw badRequest("You can only delete your own connections")
    }

    await connection.destroy()

    return { message: "Connection deleted successfully" }
  } catch (error) {
    throw badRequest(error);
  }
}
