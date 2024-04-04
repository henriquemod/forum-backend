import { type Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'
// import type { DataSource } from 'typeorm'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes')).map(async (file) => {
    const curImport = await import(`../routes/${file}`)
    curImport.default(router)
  })
  app.use('/api', router)
}
