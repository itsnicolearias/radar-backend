import { Router } from "express"
import * as authController from "../controllers/auth.controller"
import { validate } from "../middlewares/validation.middleware"
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema"

const router = Router()

router.post("/register", validate(registerUserSchema), authController.register)
router.post("/login", validate(loginUserSchema), authController.login)

export default router
