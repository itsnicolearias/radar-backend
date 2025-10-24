import { Router } from "express"
import * as profileController from "../controllers/profile.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { createProfileSchema, updateProfileSchema } from "../schemas/profile.schema"

const router = Router()

router.get("/:userId", authenticate, profileController.getProfile)
router.post("/", authenticate, validate(createProfileSchema), profileController.createProfile)
router.patch("/:userId", authenticate, validate(updateProfileSchema), profileController.updateProfile)
router.delete("/:userId", authenticate, profileController.deleteProfile)

export default router
