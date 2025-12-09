import { Router } from 'express';
import SignalController from '../controllers/signal.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { checkPlanLimits } from '../middlewares/plan.middleware';
import { validate } from '../middlewares/validation.middleware';
import { sendSignalSchema } from '../schemas/signal.schema';

const router = Router();

/**
 * @swagger
 * /api/signals/send:
 *   post:
 *     summary: Send a signal
 *     tags: [Signals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signal sent successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 */
router.post(
  '/send',
  authenticate,
  checkPlanLimits('signal'),
  validate(sendSignalSchema),
  SignalController.sendSignal
);

/**
 * @swagger
 * /api/signals/{id}:
 *   get:
 *     summary: Get a signal by ID
 *     tags: [Signals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Signal'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Signal not found
 */
router.get('/:id', authenticate, SignalController.getSignalById);

export default router;
