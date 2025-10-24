import type { Request, Response, NextFunction } from "express"
import type { ZodSchema } from "zod"
import { validationError } from "../utils/errors"

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }))

      next(validationError(JSON.stringify(errors)))
    }
  }
}
