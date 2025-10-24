import { Router } from "express"
import authRoutes from "./auth.routes"
import userRoutes from "./user.routes"
import profileRoutes from "./profile.routes"
import connectionRoutes from "./connection.routes"
import messageRoutes from "./message.routes"
import notificationRoutes from "./notification.routes"

const router = Router()

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/profiles", profileRoutes)
router.use("/connections", connectionRoutes)
router.use("/messages", messageRoutes)
router.use("/notifications", notificationRoutes)

export default router
