import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import profileRoutes from "./profile.routes"
import connectionRoutes from "./connection.routes"
import notificationRoutes from "./notification.routes"
import radarRoutes from "./radar.routes";
import eventRoutes from "./event.routes";
import signalRoutes from "./signal.routes";
import chatRoutes from "./chat.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profile", profileRoutes);
router.use("/connections", connectionRoutes);
router.use("/chats", chatRoutes);
router.use("/notifications", notificationRoutes);
router.use("/radar", radarRoutes);
router.use("/events", eventRoutes);
router.use("/signals", signalRoutes);

export default router;
