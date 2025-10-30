import { Router } from "express"
import * as connectionController from "../controllers/connection.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { createConnectionSchema, updateConnectionSchema } from "../schemas/connection.schema"

const router = Router()

/**
 * @swagger
 * /api/connections:
 *   post:
 *     summary: Create a new connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/Connection'
 *     responses:
 *       200:
 *         description: Connection created successful
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
 *                       $ref: '#/components/schemas/Connection'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", authenticate, validate(createConnectionSchema), connectionController.createConnection)

/**
 * @swagger
 * /api/connections:
 *   get:
 *     summary: Get connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *         description: Search radius in meters
 *     responses:
 *       200:
 *         description: List of connections
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
 *                     $ref: '#/components/schemas/Connection'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, connectionController.getConnections)

/**
 * @swagger
 * /api/connections:
 *   patch:
 *     summary: update a connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: connectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: connection Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 format: accepted | pending | rejected
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Connection updated successful
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
 *                       $ref: '#/components/schemas/Connection'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:connectionId", authenticate, validate(updateConnectionSchema), connectionController.updateConnection)

/**
 * @swagger
 * /api/connections:
 *   delete:
 *     summary: delete a connection
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: connectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: connection ID
 *     responses:
 *       200:
 *         description: Connection deleted successful
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
 *                       $ref: '#/components/schemas/Connection'
 *                     token:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:connectionId", authenticate, connectionController.deleteConnection)

export default router
