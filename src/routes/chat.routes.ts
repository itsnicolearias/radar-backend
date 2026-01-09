import { Router } from "express"
import * as messageController from "../controllers/message.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import {
  sendMessageSchema,
  getUploadUrlSchema,
} from '../schemas/message.schema';

const router = Router();

router.post("/:chatId/messages", authenticate, validate(sendMessageSchema), messageController.sendMessage)
router.post("/:chatId/messages/upload-url", authenticate, validate(getUploadUrlSchema), messageController.getUploadUrl)
router.get("/:chatId/messages", authenticate, messageController.getMessages)

export default router
