import { ApiError } from '../protocols/api-error'
import { HttpStatusCode } from '../protocols/http/status-codes'

export class NotFound extends ApiError {
  constructor(message = 'Not found') {
    super(HttpStatusCode.NOT_FOUND, message)
    this.name = 'NotFoundError'
  }
}
