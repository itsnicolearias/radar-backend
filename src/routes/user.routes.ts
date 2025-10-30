import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { updateLocationSchema, updateUserSchema, toggleVisibilitySchema } from "../schemas/user.schema"

const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtain loggued user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, userController.getUser)

/**
 * @swagger
 * /api/users:
 *   patch:
 *     summary: Update loggued user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch("/", authenticate, validate(updateUserSchema), userController.updateUser)

/**
 * @swagger
 * /api/users/location:
 *   patch:
 *     summary: Update user location
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: 37.7749
 *               longitude:
 *                 type: number
 *                 example: -122.4194
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch("/location", authenticate, validate(updateLocationSchema), userController.updateLocation)

/**
 * @swagger
 * /api/users/visibility:
 *   patch:
 *     summary: Toggle user visibility
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
router.patch("/visibility", authenticate, validate(toggleVisibilitySchema), userController.toggleVisibility)

export default router
