/* eslint-disable no-console */
import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import type { RedisOptions } from 'ioredis'
import { databaseInit } from './config/database'

const redisOptions: RedisOptions = {
  host: 'localhost',
  port: 6379
}

const start = async (): Promise<void> => {
  const session = await databaseInit()
  const app = makeApp({ session, queueConnection: redisOptions })

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
