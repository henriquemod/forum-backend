import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import type { ClientSession } from 'mongoose'
import { join } from 'path'

export const setupRoutes = (app: Express, session?: ClientSession): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes')).map(async (file) => {
    const curImport = await import(`../routes/${file}`)
    curImport.default(router, session)
  })
  app.use('/api', router)
}
