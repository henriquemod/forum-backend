import { type HttpResponse, type Middleware } from '../helpers'

export class AuthMiddleware implements Middleware {

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    throw new Error('Method not implemented.')
  }
}

export namespace AuthMiddleware {
  export interface Request {
    accessToken?: string
  }
}
