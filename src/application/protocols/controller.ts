import { ValidationComposite, type Validator } from '@/application/validation'
import { badRequest } from './http'
import { ApiError } from './api-error'
import { BadRequest } from '../errors'
import type { HttpResponse } from './http/responses'

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>
  buildValidators(_httpRequest: any): Validator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)

    if (error !== undefined) {
      return badRequest(new BadRequest(error.message))
    }

    try {
      return await this.perform(httpRequest)
    } catch (error) {
      return ApiError.errorHandler(error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)

    return new ValidationComposite(validators).validate()
  }
}
