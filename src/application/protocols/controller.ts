/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Validator, ValidationComposite } from '@/application/validation'

import { BadRequest } from '../errors'
import { ApiError } from './api-error'
import { badRequest } from './http'
import type { HttpResponse } from './http/responses'
import type { Session } from './session'

export interface ControllerProps {
  session?: Session
}

export abstract class Controller {
  protected readonly session?: Session
  abstract perform(httpRequest: any): Promise<HttpResponse>

  constructor(props?: ControllerProps) {
    if (props) {
      const { session } = props
      this.session = session
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
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
      await this.session?.commitTransaction()

      return res
    } catch (error) {
      await this.session?.abortTransaction()

      return ApiError.errorHandler(error)
    }
  }

  private validate(httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)

    return new ValidationComposite(validators).validate()
  }
}
