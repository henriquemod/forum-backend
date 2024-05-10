import type { Middleware } from '@/application/protocols'
import type { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptMiddleware: Adapter =
  (middleware) => async (req, res, next) => {
    const requestData = await middleware.handle(req)
    if ('data' in requestData) {
      if (!requestData.data) {
        next()
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const validEntries = Object.entries(requestData.data).filter(
          ([, value]) => value
        )
        if ('userId' in requestData.data) {
          req.body.userId = requestData.data.userId
        }
        req.locals = { ...req.locals, ...Object.fromEntries(validEntries) }
        next()
      }
    } else {
      res.status(requestData.statusCode).json({
        error: requestData.error ? requestData.error : 'Internal server error'
      })
    }
  }
