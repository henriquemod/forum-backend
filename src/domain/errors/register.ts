export class RegisterError extends Error {
  constructor() {
    super('Account registration failed')
    this.name = 'RegisterError'
  }
}
