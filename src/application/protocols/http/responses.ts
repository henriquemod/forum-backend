import type { HttpStatusCode } from './status-codes'

type SuccessResponse = HttpStatusCode.OK | HttpStatusCode.NO_CONTENT

type ErrorResponse =
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
      error: string
    }
