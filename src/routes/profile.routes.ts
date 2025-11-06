import { Router } from "express"
import * as profileController from "../controllers/profile.controller"
import ProfileViewController from "../controllers/profileView.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { createProfileSchema, updateProfileSchema } from "../schemas/profile.schema"
import { viewProfileSchema } from "../schemas/profileView.schema"

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

/**
 * @swagger
 * /api/profiles/view:
 *   post:
 *     summary: Record a profile view
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               viewedId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Profile view recorded successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post("/view", authenticate, validate(viewProfileSchema), ProfileViewController.viewProfile)

/**
 * @swagger
 * /api/profiles/views:
 *   get:
 *     summary: Get users who viewed my profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile views retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/views", authenticate, ProfileViewController.getProfileViews)

export default router
