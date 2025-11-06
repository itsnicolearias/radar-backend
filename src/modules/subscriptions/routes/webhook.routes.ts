import { Router } from "express";
import subscriptionController from "../controllers/subscription.controller";

const router = Router();

router.post("/mercadopago", subscriptionController.handleWebhook);

export default router;
