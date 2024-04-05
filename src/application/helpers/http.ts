import { ServerError, UnauthorizedError } from '../errors'

export interface HttpResponse<T = any> {
  statusCode: number
  data: T
}

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error)
})

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})