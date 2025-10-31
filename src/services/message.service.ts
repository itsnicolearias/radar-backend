import { Message, User, Connection } from "../models"
import { notFound, badRequest } from "../utils/errors"
import * as notificationService from "./notification.service"
import type { SendMessageInput, MarkAsReadInput } from "../schemas/message.schema"
import { Op } from "sequelize"
import { ConnectionStatus } from "../interfaces/connection.interface"

export const sendMessage = async (sender: { userId: string; firstName: string }, data: SendMessageInput) => {
  try {
    if (sender.userId === data.receiverId) {
      throw badRequest("Cannot send message to yourself")
    }

    const receiver = await User.findByPk(data.receiverId)
    if (!receiver) {
      throw notFound("Receiver not found")
    }

    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId: sender.userId, receiverId: data.receiverId, status: ConnectionStatus.ACCEPTED },
          { senderId: data.receiverId, receiverId: sender.userId, status: ConnectionStatus.ACCEPTED },
        ],
      },
    })

    if (!connection) {
      throw badRequest("You can only send messages to accepted connections")
    }

    const message = await Message.create({
      senderId: sender.userId,
      receiverId: data.receiverId,
      content: data.content,
    })

    await notificationService.sendNewMessageNotification(data.receiverId, sender.firstName)

    return message
  } catch (error) {
    throw error
  }
}

export const getMessagesBetweenUsers = async (userId1: string, userId2: string) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["userId", "firstName", "lastName"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["userId", "firstName", "lastName"],
        },
      ],
      order: [["createdAt", "ASC"]],
    })

    return messages
  } catch (error) {
    throw error
  }
}

export const markMessagesAsRead = async (userId: string, data: MarkAsReadInput) => {
  try {
    await Message.update(
      { isRead: true },
      {
        where: {
          messageId: data.messageIds,
          receiverId: userId,
        },
      },
    )

    return { message: "Messages marked as read" }
  } catch (error) {
    throw error
  }
}

export const getUnreadMessageCount = async (userId: string) => {
  try {
    const count = await Message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    })

    return { count }
  } catch (error) {
    throw error
  }
}
