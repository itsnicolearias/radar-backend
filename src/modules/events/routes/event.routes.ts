import { Router } from "express";
import eventController from "../controllers/event.controller";
import { validate } from "../../../middlewares/validation.middleware";
import {
  createEventSchema,
  updateEventSchema,
} from "../schemas/event.schema";
import { authenticate } from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *   get:
 *      summary: Get all api/events
 *      tags: [Events]
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: The page number to return
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: The number of items to return
 *          - in: query
 *            name: all
 *            schema:
 *              type: boolean
 *            description: Whether to return all items
 *      responses:
 *          200:
 *              description: A list of api/events
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              rows:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Event'
 *                              count:
 *                                  type: integer
 *                                  example: 1
 *
 *
 */
router.post(
  "/",
  authenticate,
  validate(createEventSchema),
  eventController.create
);
router.get("/", eventController.findAll);

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     summary: Get an event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The event id
 *     responses:
 *       200:
 *         description: The event description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: The event was not found
 */
router.get("/:eventId", authenticate, eventController.findById);
router.put(
  "/:eventId",
  authenticate,
  validate(updateEventSchema),
  eventController.update
);
router.delete("/:eventId", authenticate, eventController.delete);

/**
 * @swagger
 * /api/events/{eventId}/interest:
 *   post:
 *     summary: Add interest to an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The event id
 *     responses:
 *       204:
 *         description: The interest was successfully added
 *       404:
 *         description: The event was not found
 *   delete:
 *     summary: Remove interest from an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The event id
 *     responses:
 *       204:
 *         description: The interest was successfully removed
 *       404:
 *         description: The interest was not found
 *   get:
 *     summary: Get all interested users for an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The event id
 *     responses:
 *       200:
 *         description: A list of interested users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: The event was not found
 */
router.post(
  "/:eventId/interest",
  authenticate,
  eventController.addInterest
);
router.delete(
  "/:eventId/interest",
  authenticate,
  eventController.removeInterest
);
router.get(
  "/:eventId/interest",
  authenticate,
  eventController.findInterestedUsers
);

export default router;
