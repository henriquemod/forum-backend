import {
  Forbidden,
  NotFound,
  BadRequest,
  InternalServerError,
  Unauthorized
} from '../errors'
import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden
} from './http'
import type { HttpResponse } from './http/responses'

export abstract class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message)
  }

  public static errorHandler(error: unknown): HttpResponse {
    if (error instanceof ApiError) {
      if (error instanceof BadRequest) {
        return badRequest(error)
      }

      if (error instanceof Forbidden) {
        return forbidden(error)
      }

      if (error instanceof NotFound) {
        return notFound(error)
      }

      if (error instanceof Unauthorized) {
        return unauthorized(error)
      }

      if (error instanceof InternalServerError) {
        return serverError(error)
      }
    }

    return {
      statusCode: 500,
      error: 'Internal server error'
    }
  }
}
