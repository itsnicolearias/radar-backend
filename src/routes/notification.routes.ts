import { Router } from "express"
import * as notificationController from "../controllers/notification.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { markNotificationsAsReadSchema, notificationTokenSchema } from "../schemas/notification.schema"

const router = Router()

/**
 * @swagger
 * /notifications/token:
 *   post:
 *     summary: Save FCM token
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationToken'
 *     responses:
 *       201:
 *         description: Token saved successfully
 */
router.post("/token", authenticate, validate(notificationTokenSchema), notificationController.saveToken)

/**
 * @swagger
 * /notifications/token:
 *   delete:
 *     summary: Delete FCM token
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotificationToken'
 *     responses:
 *       200:
 *         description: Token deleted successfully
 */
router.delete("/token", authenticate, validate(notificationTokenSchema), notificationController.deleteToken)

router.get("/", authenticate, notificationController.getNotifications)
router.patch("/read", authenticate, validate(markNotificationsAsReadSchema), notificationController.markAsRead)
router.get("/unread/count", authenticate, notificationController.getUnreadCount)
router.delete("/:notificationId", authenticate, notificationController.deleteNotification)

export default router
