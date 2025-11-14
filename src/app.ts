import express, { type Application, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import routes from "./routes"
import { handleError } from "./utils/errors"
import logger from "./utils/logger"
import { swaggerSpec } from "./config/swagger"
//import { config } from "./config/config"

dotenv.config()

const app: Application = express()

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => {
        logger.info(message.trim())
      },
    },
  })
)

/*const whiteList: RegExp[] = [
  new RegExp(config.clientUrl), // convierte el string en RegExp
//.localhost:3000$/
];*/

const options: cors.CorsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "*",
  credentials: true,
};


app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

app.use("/api", routes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
  const boomError = handleError(error as Error)

  logger.error("Error occurred", {
    path: req.path,
    method: req.method,
    error: boomError.message,
  })

  res.status(boomError.output.statusCode).json({
    success: false,
    message: boomError.message,
    ...(process.env.NODE_ENV === "development" && { stack: error instanceof Error ? error.stack : null }),
  })
})

export default app
