import { Router } from "express"
import * as radarController from "../controllers/radar.controller"
import { authenticate } from "../middlewares/auth.middleware"

const router = Router()

/**
 * @swagger
 * /api/radar/nearby:
 *   get:
 *     summary: Get nearby users, events, and signals
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
 *         description: An object containing lists of nearby users, events, and signals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                     signals:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Signal'
 *       401:
 *         description: Unauthorized
 */
router.get("/nearby", authenticate, radarController.getNearby)

export default router
