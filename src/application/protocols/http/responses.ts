/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HttpStatusCode } from './status-codes'

export type SuccessResponse = HttpStatusCode.OK | HttpStatusCode.NO_CONTENT

type ErrorResponse =
  | HttpStatusCode.BAD_REQUEST
  | HttpStatusCode.UNAUTHORIZED
  | HttpStatusCode.FORBIDDEN
  | HttpStatusCode.NOT_FOUND
  | HttpStatusCode.SERVER_ERROR

export type HttpResponse<T = any> =
  | {
      statusCode: ErrorResponse
      error: string
    }
  | {
      statusCode: SuccessResponse
      data: T
    }
