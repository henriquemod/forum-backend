import { ApiError } from '../protocols/api-error'
import { HttpStatusCode } from '../protocols/http/status-codes'

export class Unauthorized extends ApiError {
  constructor(message = 'Unauthorized') {
    super(HttpStatusCode.UNAUTHORIZED, message)
    this.name = 'UnauthorizedError'
  }
}
