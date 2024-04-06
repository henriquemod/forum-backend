import { ServerError, UnauthorizedError } from '../errors'

export enum HttpStatusCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export type SuccessResponse = HttpStatusCode.OK | HttpStatusCode.NO_CONTENT

export type ErrorResponse =
  | HttpStatusCode.BAD_REQUEST
  | HttpStatusCode.UNAUTHORIZED
  | HttpStatusCode.FORBIDDEN
  | HttpStatusCode.NOT_FOUND
  | HttpStatusCode.SERVER_ERROR

export type HttpResponse<T = any> =
  | {
      statusCode: SuccessResponse
      data: T
    }
  | {
      statusCode: ErrorResponse
      error: Error
    }

export const forbidden = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.FORBIDDEN,
  error
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.BAD_REQUEST,
  error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.UNAUTHORIZED,
  error: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: HttpStatusCode.SERVER_ERROR,
  error: new ServerError(error)
})

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: HttpStatusCode.OK,
  data
})

export const noContent = (): HttpResponse => ({
  statusCode: HttpStatusCode.NO_CONTENT,
  data: null
})
