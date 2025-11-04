import { Router } from "express"
import * as profileController from "../controllers/profile.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { createProfileSchema, updateProfileSchema } from "../schemas/profile.schema"

const router = Router()

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Get my profile
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile obtained successfully
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
 *                     $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, profileController.getProfile)
router.post("/", authenticate, validate(createProfileSchema), profileController.createProfile)

/**
 * @swagger
 * /api/profiles:
 *   patch:
 *     summary: update my profile
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     connection:
 *                       $ref: '#/components/schemas/Profile'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/", authenticate, validate(updateProfileSchema), profileController.updateProfile)
router.delete("/", authenticate, profileController.deleteProfile)

export default router
