import { Message, User, Connection } from '../models';
import { notFound, badRequest } from '../utils/errors';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import type { SendMessageInput, MarkAsReadInput } from '../schemas/message.schema';
import { Op } from 'sequelize';
import sequelize from '../config/sequelize';
import { ConnectionStatus } from '../interfaces/connection.interface';

export const sendMessage = async (senderId: string, data: SendMessageInput) => {
  try {
    if (senderId === data.receiverId) {
      throw badRequest("Cannot send message to yourself")
    }

    const receiver = await User.findByPk(data.receiverId)
    if (!receiver) {
      throw notFound("Receiver not found")
    }

    const connection = await Connection.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId: data.receiverId, status: ConnectionStatus.ACCEPTED },
          { senderId: data.receiverId, receiverId: senderId, status: ConnectionStatus.ACCEPTED },
        ],
      },
    })

    if (!connection) {
      throw badRequest("You can only send messages to accepted connections")
    }

    const { ciphertext, iv, authTag } = encryptMessage(data.content);

    const message = await Message.create({
      senderId,
      receiverId: data.receiverId,
      content: ciphertext,
      iv,
      authTag,
    });

    return message
  } catch (error) {
    throw badRequest(error);
  }
}

export const getRecentConversations = async (
  userId: string,
  page: number,
  limit: number,
  all: boolean,
) => {
  try {
    const { count, rows: conversations } = await Message.findAndCountAll({
      attributes: [
        [
          sequelize.literal(
            'CASE WHEN "sender_id" = :userId THEN "receiver_id" ELSE "sender_id" END',
          ),
          'conversationId',
        ],
      ],
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      group: ['conversationId'],
      order: [[sequelize.fn('MAX', sequelize.col('createdAt')), 'DESC']],
      limit: all ? undefined : limit,
      offset: all ? undefined : (page - 1) * limit,
      replacements: { userId },
      subQuery: false,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['userId', 'displayName', 'avatarUrl', 'isVerified'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['userId', 'displayName', 'avatarUrl', 'isVerified'],
        },
      ],
    });

    const mappedConversations = await Promise.all(
      conversations.map(async (conv: any ) => {

        const otherUser =
          conv.sender.userId === userId ? conv.receiver : conv.sender;
        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { senderId: userId, receiverId: otherUser.userId },
              { senderId: otherUser.userId, receiverId: userId },
            ],
          },
          order: [['createdAt', 'DESC']],
        });

        const unreadCount = await Message.count({
          where: {
            senderId: otherUser.userId,
            receiverId: userId,
            isRead: false,
          },
        });

        let content = lastMessage?.content;
        if (lastMessage?.content && lastMessage?.iv && lastMessage?.authTag) {
          content = decryptMessage(
            lastMessage.content,
            lastMessage.iv,
            lastMessage.authTag,
          );
        }

        return {
          conversationId: `${userId}-${otherUser.userId}`,
          user: {
            userId: otherUser.userId,
            displayName: otherUser.displayName,
            avatarUrl: otherUser.avatarUrl,
            isVerified: otherUser.isVerified,
          },
          lastMessage: {
            content,
            createdAt: lastMessage?.createdAt,
            isRead: lastMessage?.isRead,
            senderId: lastMessage?.senderId,
          },
          unreadCount,
        };
      }),
    );

    return { conversations: mappedConversations, total: count.length };
  } catch (error) {
    throw badRequest(error);
  }
};

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
    });

    return messages.map((message) => {
      if (message.content && message.iv && message.authTag) {
        message.content = decryptMessage(
          message.content,
          message.iv,
          message.authTag,
        );
      }
      return message;
    });
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
