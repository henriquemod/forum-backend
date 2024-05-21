/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationComposite, type Validator } from '@/application/validation'
import { BadRequest } from '../errors'
import { ApiError } from './api-error'
import { badRequest } from './http'
import type { HttpResponse } from './http/responses'
import type { Session } from './session'

export abstract class Controller {
  abstract perform(httpRequest: any): Promise<HttpResponse>

  constructor(protected readonly session?: Session) {}

  buildValidators(_httpRequest: any): Validator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)

    if (error !== undefined) {
      return badRequest(new BadRequest(error.message))
    }

    try {
      this.session?.startTransaction()
      const res = await this.perform(httpRequest)
      this.session?.commitTransaction()

      return res
    } catch (error) {
      this.session?.abortTransaction()
      return ApiError.errorHandler(error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)

    return new ValidationComposite(validators).validate()
  }
}
