import { Router } from "express"
import * as messageController from "../controllers/message.controller"
import { authenticate } from "../middleware/auth.middleware"
import { validate } from "../middleware/validation.middleware"
import { sendMessageSchema, markAsReadSchema } from "../schemas/message.schema"

const router = Router()

router.post("/", authenticate, validate(sendMessageSchema), messageController.sendMessage)
router.get("/:userId", authenticate, messageController.getMessages)
router.patch("/read", authenticate, validate(markAsReadSchema), messageController.markAsRead)
router.get("/unread/count", authenticate, messageController.getUnreadCount)

export default router
