import { Router } from "express"
import * as radarController from "../controllers/radar.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @swagger
 * /api/radar/nearby:
 *   get:
 *     summary: Get nearby users
 *     tags: [Radar]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Current latitude
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: Current longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 1000
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: List of nearby users
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
router.get("/nearby", authenticate, radarController.getNearbyUsers)

export default router
