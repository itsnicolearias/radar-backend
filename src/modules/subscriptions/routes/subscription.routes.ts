import { Router } from "express";
import subscriptionController from "../controllers/subscription.controller";
import { authenticate } from "../../../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticate, subscriptionController.createPreference);

export default router;
