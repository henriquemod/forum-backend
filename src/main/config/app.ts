import express from 'express'
import { setupMiddlewares } from './middlewares'
import { type ExtraParams, setupRoutes } from './routes'

const makeApp = ({
  session,
  queueConnection
}: ExtraParams): express.Express => {
  const app = express()

  setupMiddlewares(app)
  setupRoutes(app, { session, queueConnection })

  return app
}

export { makeApp }
