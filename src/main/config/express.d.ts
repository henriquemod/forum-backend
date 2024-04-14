/* eslint-disable @typescript-eslint/no-explicit-any */
export declare global {
  namespace Express {
    interface Request {
      user?: any
      locals?: any
    }
  }
}
