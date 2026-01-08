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
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 example: "id123"
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
 * /api/connections/accepted:
 *   get:
 *     summary: Get accepted connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
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
router.get("/accepted", authenticate, connectionController.getAcceptedConnections)

/**
 * @swagger
 * /api/connections/pendings:
 *   get:
 *     summary: Get pendings connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
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
router.get("/pendings", authenticate, connectionController.getPendingConnections)

/**
 * @swagger
 * /api/connections/pendings/me:
 *   get:
 *     summary: Get my pendings connections
 *     tags: [Connections]
 *     security:
 *       - bearerAuth: []
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
router.get("/pendings/me", authenticate, connectionController.getMyPendingConnections)

/**
 * @swagger
 * /api/connections/{connectionId}:
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
 * /api/connections/{connectionId}:
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
