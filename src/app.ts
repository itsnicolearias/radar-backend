import express, { type Application, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import routes from "./routes"
import { handleError } from "./utils/errors"
import logger from "./utils/logger"

dotenv.config()

const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

app.use("/api", routes)

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const boomError = handleError(error)

  logger.error("Error occurred", {
    path: req.path,
    method: req.method,
    error: boomError.message,
  })

  res.status(boomError.output.statusCode).json({
    success: false,
    message: boomError.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

export default app
