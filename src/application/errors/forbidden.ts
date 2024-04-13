import { ApiError } from '../protocols/api-error'
import { HttpStatusCode } from '../protocols/http/status-codes'

export class Forbidden extends ApiError {
  constructor(message = 'Forbidden') {
    super(HttpStatusCode.FORBIDDEN, message)
    this.name = 'ForbiddenError'
  }
}
