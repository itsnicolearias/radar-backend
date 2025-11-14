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

export default router;
