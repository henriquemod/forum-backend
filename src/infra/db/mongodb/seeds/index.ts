/* eslint-disable no-console */

/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type { ConnectionOptions } from 'bullmq'
import { readdirSync } from 'fs'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { join } from 'path'

import { env } from '@/main/config/env'

export interface ExtraParams {
  session?: ClientSession
  queueConnection?: ConnectionOptions
}

const runSeeds = async (): Promise<void> => {
  await mongoose.connect(env.mongoUrl)

  const paths = readdirSync(join(__dirname, './data'))
  console.log({ paths })

  for (let i = 0; i < paths.length; i++) {
    const file = paths[i]
    const curImport = await import(`./data/${file}`)
    await curImport.default()
  }
  mongoose.connection.close()
  console.log('Seeds ran successfully!')
}

runSeeds().catch(console.error)
