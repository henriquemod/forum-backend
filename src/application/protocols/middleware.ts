/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HttpResponse } from './http/responses'

export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
