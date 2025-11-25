import { notFound, badRequest } from '../utils/errors';
import type { SendMessageInput, MarkAsReadInput } from '../schemas/message.schema';
import { Op } from 'sequelize';
import Message from "../models/message.model"
import Signal from '../models/signal.model';
import User from "../models/user.model";
import Connection from "../models/connection.model";
import Profile from "../models/profile.model";
import type {
  IMessageResponse,
} from "../interfaces/message.interface"
import { _ConnectionStatus } from '../interfaces/connection.interface';
import { getNearbyUsers } from './radar.service';
import { IRadarUserResponse } from '../interfaces/radar.interface';
import { sequelize } from '../models';
import { getUserById } from './user.service';

export const sendMessage = async (senderId: string, data: SendMessageInput): Promise<IMessageResponse> => {
  try {
    if (senderId === data.receiverId) {
      throw badRequest("Cannot send message to yourself");
    }

  const sender = await User.findByPk(senderId);
  if (!sender) {
    throw notFound("Sender not found");
  }

  const receiver = await User.findByPk(data.receiverId);
  if (!receiver) {
    throw notFound("Receiver not found");
  }

  if (data.signalId) {
    if (!sender.isVisible) {
      throw badRequest("You cannot reply to signals while invisible");
    }

    if (!sender.lastLatitude || !sender.lastLongitude) {
      throw badRequest("Your location is not available");
    }

    const signal = await Signal.findByPk(data.signalId);
    if (!signal) {
      throw notFound("Signal not found");
    }

    const radarConnections = await getNearbyUsers(receiver.userId, { latitude: sender.lastLatitude, longitude: sender.lastLongitude, radius: 5000 });
    const isReceiverInRadar = radarConnections.some(
      (connection: IRadarUserResponse) => connection.userId === signal.senderId
    );

    if (signal.senderId !== data.receiverId && !isReceiverInRadar) {
      throw badRequest("Signal does not belong to the receiver or is not in their radar");
    }
  } else {
    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId: data.receiverId, status: _ConnectionStatus.ACCEPTED },
          { senderId: data.receiverId, receiverId: senderId, status: _ConnectionStatus.ACCEPTED },
        ],
      },
    });

    if (!connection) {
      throw badRequest("You can only send messages to accepted connections");
    }
  }

  const message = await Message.create({
    senderId,
    receiverId: data.receiverId,
    content: data.content,
    signalId: data.signalId,
    isRead: false,
  });

  const messageResponse: IMessageResponse = message.toJSON();

  if (message.signalId) {
    const signal = await Signal.findByPk(message.signalId);
    if (signal) {
      messageResponse.Signal = signal.toJSON();
    }
  }

  return messageResponse;
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

    const logguedUser = await getUserById(userId);

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
        attributes: {
          include: [
            [
              sequelize.literal(`
                ST_Distance(
                  ST_MakePoint(${logguedUser.lastLongitude}, ${logguedUser.lastLatitude})::geography,
                  ST_MakePoint(last_longitude, last_latitude)::geography
                )
              `),
              "distance", 
            ],
            "userId", "displayName", "email"
          ],
        }, 
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
    const logguedUser = await getUserById(userId1);

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
        "Signal",
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
