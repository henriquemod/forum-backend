import type { Controller } from '@/application/protocols'
import type { RequestHandler } from 'express'

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req, res) => {
    const content =
      req.method === 'GET' ? { ...req.query, ...req.params } : req.body
    const httpResponse = await controller.handle({ ...content })
    if ('data' in httpResponse) {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.error })
    }
  }
}
