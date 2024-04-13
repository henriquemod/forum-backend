import type {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  Unauthorized
} from '../errors'
import type { HttpResponse } from './http/responses'
import { HttpStatusCode } from './http/status-codes'

export const forbidden = (error: Forbidden): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.FORBIDDEN,
  error: error.message
})

export const badRequest = (error: BadRequest): HttpResponse<Error> => ({
  statusCode: error.statusCode,
  error: error.message
})

export const unauthorized = (error: Unauthorized): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.UNAUTHORIZED,
  error: error.message
})

export const serverError = (
  error: InternalServerError
): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  error: error.message
})

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  data
})

export const noContent = (): HttpResponse => ({
  statusCode: HttpStatusCode.NO_CONTENT,
  data: null
})

export const notFound = (error: NotFound): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.NOT_FOUND,
  error: error.message
})
