import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { updateLocationSchema, updateUserSchema, toggleVisibilitySchema } from "../schemas/user.schema"

const router = Router()

router.get("/:id", authenticate, userController.getUser)
router.patch("/:id", authenticate, validate(updateUserSchema), userController.updateUser)
router.patch("/:id/location", authenticate, validate(updateLocationSchema), userController.updateLocation)

/**
 * @swagger
 * /api/users/{id}/visibility:
 *   patch:
 *     summary: Toggle user visibility
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isVisible
 *             properties:
 *               isVisible:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Visibility updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch("/:id/visibility", authenticate, validate(toggleVisibilitySchema), userController.toggleVisibility)

export default router
