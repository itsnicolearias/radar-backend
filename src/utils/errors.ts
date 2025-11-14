import Boom from "@hapi/boom"

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleError = (error: Error) => {
  if (Boom.isBoom(error)) {
    return error
  }

  if (error instanceof AppError) {
    return Boom.boomify(error, { statusCode: error.statusCode })
  }

  // eslint-disable-next-line no-console
  console.error("Unexpected error:", error)
  return Boom.internal("An unexpected error occurred")
}

export const notFound = (message = "Resource not found") => {
  return Boom.notFound(message)
}

export const badRequest = (message = "Bad request") => {
  return Boom.badRequest(message)
}

export const unauthorized = (message = "Unauthorized") => {
  return Boom.unauthorized(message)
}

export const forbidden = (message = "Forbidden") => {
  return Boom.forbidden(message)
}

export const conflict = (message = "Conflict") => {
  return Boom.conflict(message)
}

export const validationError = (message = "Validation error") => {
  return Boom.badData(message)
}
