import type { Controller } from '@/application/controllers'
import type { Request, RequestHandler, Response } from 'express'

export class ExpressRouter {
  constructor(private readonly controller: Controller) {}
  async adapt(req: Request, res: Response): Promise<void> {
    const { statusCode, data } = await this.controller.handle({ ...req.body })
    const json =
      statusCode >= 200 && statusCode <= 299 ? data : { error: data.message }

    res.status(statusCode).json(json)
  }
}

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body })
    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    } else {
      res
        .status(httpResponse.statusCode)
        .json({ error: httpResponse.data.message })
    }
  }
}
