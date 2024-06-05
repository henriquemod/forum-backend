import express from 'express'

import { setupMiddlewares } from './middlewares'
import { type ExtraParams, setupRoutes } from './routes'
import { setupSwagger } from './swagger'
import { setupWorkers } from './workers'

const makeApp = ({
  session,
  queueConnection
}: ExtraParams): express.Express => {
  const app = express()
  setupSwagger(app)

  setupMiddlewares(app)
  setupRoutes(app, { session, queueConnection })
  setupWorkers(queueConnection)

  return app
}

export { makeApp }
