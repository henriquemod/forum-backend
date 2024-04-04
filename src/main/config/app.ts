import express from 'express'
import { setupMiddlewares } from './middlewares'
import { setupRoutes } from './routes'
// import { type DataSource } from 'typeorm'

const makeApp = (): express.Express => {
  const app = express()

  setupMiddlewares(app)
  setupRoutes(app)

  return app
}

export { makeApp }
