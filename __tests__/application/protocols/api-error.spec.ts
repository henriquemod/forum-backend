import {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  Unauthorized
} from '@/application/errors'
import {
  badRequest,
  forbidden,
  notFound,
  serverError,
  unauthorized
} from '@/application/protocols'
import { ApiError } from '@/application/protocols/api-error'

describe('ApiError', () => {
  describe('errorHandler', () => {
    it('should return 500 status code and "Internal server error" message if error is not an instance of ApiError', () => {
      const error = new Error('Some error')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual({
        statusCode: 500,
        error: 'Internal server error'
      })
    })

    it('should return 400 status code and the error message if error is an instance of BadRequest', () => {
      const error = new BadRequest('Bad request')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual(badRequest(error))
    })

    it('should return 401 status code and the error message if error is an instance of Unauthorized', () => {
      const error = new Unauthorized('Forbidden')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual(unauthorized(error))
    })

    it('should return 403 status code and the error message if error is an instance of Forbidden', () => {
      const error = new Forbidden('Forbidden')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual(forbidden(error))
    })

    it('should return 404 status code and the error message if error is an instance of NotFound', () => {
      const error = new NotFound('Not found')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual(notFound(error))
    })

    it('should return 500 status code and the error message if error is an instance of InternalServerError', () => {
      const error = new InternalServerError('Server error')
      const response = ApiError.errorHandler(error)

      expect(response).toEqual(serverError(error))
    })
  })
})
