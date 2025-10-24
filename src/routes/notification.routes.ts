import { Router } from "express"
import * as notificationController from "../controllers/notification.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { markNotificationsAsReadSchema } from "../schemas/notification.schema"

const router = Router()

router.get("/", authenticate, notificationController.getNotifications)
router.patch("/read", authenticate, validate(markNotificationsAsReadSchema), notificationController.markAsRead)
router.get("/unread/count", authenticate, notificationController.getUnreadCount)
router.delete("/:notificationId", authenticate, notificationController.deleteNotification)

export default router
