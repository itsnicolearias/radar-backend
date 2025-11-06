import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import profileRoutes from "./profile.routes"
import connectionRoutes from "./connection.routes"
import messageRoutes from "./message.routes"
import notificationRoutes from "./notification.routes"
import radarRoutes from "./radar.routes";
import eventRoutes from "../modules/events/routes/event.routes";
import subscriptionRoutes from "../modules/subscriptions/routes/subscription.routes";
import webhookRoutes from "../modules/subscriptions/routes/webhook.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/connections", connectionRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/radar", radarRoutes);
router.use("/events", eventRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/webhooks", webhookRoutes);

export default router;
