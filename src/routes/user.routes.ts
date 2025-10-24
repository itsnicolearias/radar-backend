import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { updateLocationSchema, updateUserSchema } from "../schemas/user.schema"

const router = Router()

router.get("/:id", authenticate, userController.getUser)
router.patch("/:id", authenticate, validate(updateUserSchema), userController.updateUser)
router.patch("/:id/location", authenticate, validate(updateLocationSchema), userController.updateLocation)

export default router
