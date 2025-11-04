import * as notificationService from "./notification.service"
import type { SendMessageInput, MarkAsReadInput } from "../schemas/message.schema"
import { Op } from "sequelize"
import { ConnectionStatus } from "../interfaces/connection.interface"
import { notFound, badRequest } from '../utils/errors';
import { encryptMessage } from '../utils/crypto';
import Message from "../models/message.model"
import User from "../models/user.model";
import Connection from "../models/connection.model";
import Profile from "../models/profile.model";



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

    const { ciphertext, iv, authTag } = encryptMessage(data.content);

    const message = await Message.create({
      senderId: sender.userId,
      receiverId: data.receiverId,
      content: ciphertext,
      iv,
      authTag,
    });

    await notificationService.sendNewMessageNotification(data.receiverId, sender.firstName)

    return message
  } catch (error) {
    throw badRequest(error);
  }
}

export const getRecentConversations = async (
  userId: string,
  page = 1,
  limit = 10,
  all = false
) => {
  try {
    // 1️⃣ Buscar todos los mensajes del usuario
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [['createdAt', 'DESC']],
    })

    // 2️⃣ Agrupar por el otro usuario
    const seen = new Set<string>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversations: any[] = []

    for (const msg of messages) {
      const otherUserId =
        msg.senderId === userId ? msg.receiverId : msg.senderId

      if (!otherUserId || seen.has(otherUserId)) continue
      seen.add(otherUserId)

      const otherUser = await User.findByPk(otherUserId, {
        attributes: ['userId', 'displayName', 'isVerified'],
        raw: true,
        include: [
          {
            model: Profile,
            attributes: ["photoUrl"],
            as: "Profile"

          },
        ],
      })

      const unreadCount = await Message.count({
        where: {
          senderId: otherUserId,
          receiverId: userId,
          isRead: false,
        },
      })

      conversations.push({
        conversationId: `${userId}-${otherUserId}`,
        user: otherUser,
        lastMessage: {
          content: msg.content,
          createdAt: msg.createdAt,
          isRead: msg.isRead,
          senderId: msg.senderId,
        },
        unreadCount,
      })
    }

    // 3️⃣ Paginación simple
    const paginated = all
      ? conversations
      : conversations.slice((page - 1) * limit, page * limit)

    return { conversations: paginated, total: conversations.length }
  } catch (error) {
    throw badRequest(error)
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
          include: [
          {
            model: Profile,
            attributes: ["photoUrl"],
            as: "Profile"

          },
        ],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["userId", "firstName", "lastName"],
          include: [
          {
            model: Profile,
            attributes: ["photoUrl"],
            as: "Profile"

          },
        ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return messages;
  } catch (error) {
    throw badRequest(error);
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
      }
    )

    return { message: "Messages marked as read" }
  } catch (error) {
    throw badRequest(error);
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
    throw badRequest(error);
  }
}
