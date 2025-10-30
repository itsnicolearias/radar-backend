import { Message, User, Connection } from '../models';
import { notFound, badRequest } from '../utils/errors';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import type { SendMessageInput, MarkAsReadInput } from '../schemas/message.schema';
import { Op, Sequelize } from 'sequelize';
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
    const subQuery = `
      SELECT
        CASE
          WHEN sender_id = :userId THEN receiver_id
          ELSE sender_id
        END as "conversationId",
        MAX(created_at) as "lastMessageDate"
      FROM messages
      WHERE sender_id = :userId OR receiver_id = :userId
      GROUP BY "conversationId"
    `;

    const conversations = await sequelize.query(
      `
      SELECT
        c."conversationId",
        u."userId",
        u."displayName",
        u."avatarUrl",
        u."isVerified",
        m.content as "lastMessageContent",
        m.iv as "lastMessageIv",
        m.auth_tag as "lastMessageAuthTag",
        m."createdAt" as "lastMessageCreatedAt",
        m."isRead" as "lastMessageIsRead",
        m."senderId" as "lastMessageSenderId",
        (
          SELECT COUNT(*)
          FROM messages
          WHERE
            (
              (sender_id = c."conversationId" AND receiver_id = :userId)
            ) AND "isRead" = false
        ) as "unreadCount"
      FROM (${subQuery}) as c
      LEFT JOIN users u ON u.user_id = c."conversationId"
      LEFT JOIN messages m ON m.created_at = c."lastMessageDate"
        AND (
          (m.sender_id = :userId AND m.receiver_id = c."conversationId") OR
          (m.sender_id = c."conversationId" AND m.receiver_id = :userId)
        )
      ORDER BY c."lastMessageDate" DESC
      LIMIT :limit
      OFFSET :offset
    `,
      {
        replacements: {
          userId,
          limit: all ? null : limit,
          offset: all ? null : (page - 1) * limit,
        },
        type: 'SELECT',
      },
    );

    const totalResult = await sequelize.query(
      `SELECT COUNT(*) FROM (${subQuery}) as c`,
      {
        replacements: { userId },
        type: 'SELECT',
      },
    );
    const total = parseInt((totalResult[0] as any).count, 10);

    const mappedConversations = conversations.map((conv: any) => {
      let content = conv.lastMessageContent;
      if (content && conv.lastMessageIv && conv.lastMessageAuthTag) {
        content = decryptMessage(
          content,
          conv.lastMessageIv,
          conv.lastMessageAuthTag,
        );
      }

      return {
        conversationId: `${userId}-${conv.conversationId}`,
        user: {
          userId: conv.userId,
          displayName: conv.displayName,
          avatarUrl: conv.avatarUrl,
          isVerified: conv.isVerified,
        },
        lastMessage: {
          content,
          createdAt: conv.lastMessageCreatedAt,
          isRead: conv.lastMessageIsRead,
          senderId: conv.lastMessageSenderId,
        },
        unreadCount: conv.unreadCount,
      };
    });

    return { conversations: mappedConversations, total };
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
