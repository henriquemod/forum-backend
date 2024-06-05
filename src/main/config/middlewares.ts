import cors from 'cors'
import { type Express, json } from 'express'

export const setupMiddlewares = (app: Express): void => {
  app.use(cors())
  app.use(json())
  app.use((_req, res, next) => {
    res.type('html')
    next()
  })
}
