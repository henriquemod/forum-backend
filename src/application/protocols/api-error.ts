import { Forbidden, NotFound, BadRequest } from '../errors'
import { badRequest, serverError, unauthorized, notFound } from './http'
import type { HttpResponse } from './http/responses'

export abstract class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message)
  }

  public static errorHandler(error: unknown): HttpResponse {
    if (!(error instanceof ApiError)) {
      return {
        statusCode: 500,
        error: 'Internal server error'
      }
    }

    if (error instanceof BadRequest) {
      return badRequest(error)
    }

    if (error instanceof Forbidden) {
      return unauthorized(error)
    }

    if (error instanceof NotFound) {
      return notFound(error)
    }

    return serverError(error)
  }
}
