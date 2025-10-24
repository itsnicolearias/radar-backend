import { Router } from "express"
import * as connectionController from "../controllers/connection.controller"
import { authenticate } from "../middlewares/auth.middleware"
import { validate } from "../middlewares/validation.middleware"
import { createConnectionSchema, updateConnectionSchema } from "../schemas/connection.schema"

const router = Router()

router.post("/", authenticate, validate(createConnectionSchema), connectionController.createConnection)
router.get("/", authenticate, connectionController.getConnections)
router.patch("/:connectionId", authenticate, validate(updateConnectionSchema), connectionController.updateConnection)
router.delete("/:connectionId", authenticate, connectionController.deleteConnection)

export default router
