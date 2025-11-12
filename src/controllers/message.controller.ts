import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware';
import * as messageService from '../services/message.service';
import { createNotification } from '../services/notification.service';
import { NotificationType } from '../interfaces/notification.interface';
import { getSocketIo } from '../config/socket';
import Signal from '../models/signal.model';
import type {
  SendMessageInput,
  MarkAsReadInput,
} from '../schemas/message.schema';
import { getPagination } from '../utils/pagination';

export const createMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: SendMessageInput = req.body;
    const sender = req.user;

    if (!sender) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const message = await messageService.createMessage(sender.userId, data);

    if (data.signalId) {
      const signal = await Signal.findByPk(data.signalId);
      if (signal) {
        const io = getSocketIo();
        const notificationMessage = `${sender.firstName} has replied to your signal.`;

        await createNotification(
          signal.senderId,
          NotificationType.SIGNAL_REPLY,
          notificationMessage,
        );

        io.to(signal.senderId).emit('signal:reply', {
          fromUser: sender.userId,
          messagePreview: data.content,
          signalId: data.signalId,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    return next(error);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.userId

    if (!currentUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const messages = await messageService.getMessagesBetweenUsers(currentUserId, userId)

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    return next(error)
  }
}

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data: MarkAsReadInput = req.body
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const result = await messageService.markMessagesAsRead(userId, data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    return next(error)
  }
}

export const getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const result = await messageService.getUnreadMessageCount(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const getRecentConversations = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { page, limit, all } = getPagination(req.query);
    const { conversations, total } = await messageService.getRecentConversations(
      userId,
      page,
      limit,
      all,
    );

    res.status(200).json({
      success: true,
      data: {
        conversations,
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    return next(error);
  }
};
