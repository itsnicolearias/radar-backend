import { notFound, badRequest, conflict } from "../utils/errors"
import type { CreateConnectionInput, UpdateConnectionInput } from "../schemas/connection.schema"
import { Op } from "sequelize"
import { ConnectionStatus } from "../interfaces/connection.interface"
import User from "../models/user.model"
import Connection from "../models/connection.model"
import type { IConnectionResponse, IDeleteConnectionResponse } from "../interfaces/connection.interface"

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

    if (connection.status !== ConnectionStatus.PENDING) {
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
    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
        [Op.and]: [{status: "accepted"}],
        
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["userId", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["userId", "firstName", "lastName", "email"],
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
    const connections = await Connection.findAll({
      where: {
        receiverId: userId, 
        status: "pending"
      },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["userId", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["userId", "firstName", "lastName", "email"],
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
