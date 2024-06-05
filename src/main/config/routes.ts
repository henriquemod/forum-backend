import type { ConnectionOptions } from 'bullmq'
import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import type { ClientSession } from 'mongoose'
import { join } from 'path'

export interface ExtraParams {
  session?: ClientSession
  queueConnection: ConnectionOptions
}

export const setupRoutes = (app: Express, params: ExtraParams): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes')).map(async (file) => {
    const curImport = await import(`../routes/${file}`)
    curImport.default(router, params)
  })
  app.use('/api', router)
}
