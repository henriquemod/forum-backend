export class ServerError extends Error {
  constructor(error?: Error) {
    super(`Internal server error: ${error?.message ?? 'unknown'}`)
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class AccessDeniedError extends Error {
  constructor() {
    super('Access denied')
    this.name = 'AccessDeniedError'
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super('Authentication failed')
    this.name = 'AuthenticationError'
  }
}

export class RegisterError extends Error {
  constructor() {
    super('Account registration failed')
    this.name = 'RegisterError'
  }
}
