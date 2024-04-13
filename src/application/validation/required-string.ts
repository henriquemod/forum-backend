import { BadRequest } from '@/application/errors'

export class RequiredStringValidator {
  constructor(
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate(): Error | undefined {
    if (this.value === '' || this.value === null || this.value === undefined) {
      return new BadRequest(`The field ${this.fieldName} is required`)
    }
  }
}
