import { ApiError } from '../protocols/api-error'
import { HttpStatusCode } from '../protocols/http/status-codes'

export class BadRequest extends ApiError {
  constructor(message: string) {
    super(HttpStatusCode.BAD_REQUEST, message)
  }
}
