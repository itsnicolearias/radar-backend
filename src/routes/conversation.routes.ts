import { Router } from "express"
import * as conversationController from "../controllers/conversation.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router();

/**
 * @swagger
 * /api/conversations/{otherUserId}:
 *   delete:
 *     summary: Delete a conversation (soft delete)
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete conversation with
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/:otherUserId", authenticate, conversationController.deleteConversation)

export default router
