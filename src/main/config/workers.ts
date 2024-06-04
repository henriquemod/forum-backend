import type { ConnectionOptions } from 'bullmq'
import { readdirSync } from 'fs'
import { join } from 'path'

export const setupWorkers = (queueConnection?: ConnectionOptions): void => {
  readdirSync(join(__dirname, '../workers')).map(async (file) => {
    const curImport = await import(`../workers/${file}`)
    curImport.default(queueConnection)
  })
}
