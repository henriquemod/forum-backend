import { ApiError } from '../protocols/api-error'
import { HttpStatusCode } from '../protocols/http/status-codes'

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super(HttpStatusCode.SERVER_ERROR, message)
    this.name = 'ServerError'
  }
}
