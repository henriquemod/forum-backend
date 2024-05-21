import express from 'express'
import { setupMiddlewares } from './middlewares'
import { setupRoutes } from './routes'
import type { ClientSession } from 'mongoose'

const makeApp = (session?: ClientSession): express.Express => {
  const app = express()

  setupMiddlewares(app)
  setupRoutes(app, session)

  return app
}

export { makeApp }
