import type { Middleware } from '@/application/protocols'
import type { RequestHandler } from 'express'

type Adapter = (middleware: Middleware) => RequestHandler

export const adaptMiddleware: Adapter =
  (middleware) => async (req, res, next) => {
    const { statusCode, data } = await middleware.handle({ ...req.headers })
    if (statusCode >= 200 && statusCode <= 299) {
      if (!data) {
        next()
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const validEntries = Object.entries(data).filter(([, value]) => value)
        req.locals = { ...req.locals, ...Object.fromEntries(validEntries) }
        next()
      }
    } else {
      res
        .status(statusCode)
        .json({ error: data ? data.message : 'Internal server error' })
    }
  }
