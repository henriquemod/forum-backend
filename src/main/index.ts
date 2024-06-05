/* eslint-disable no-console */
import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'

import { databaseInit } from './config/database'
import { makeRedisConnection } from './config/redis-connection'

const start = async (): Promise<void> => {
  const session = await databaseInit()
  const redisConnection = makeRedisConnection()
  const app = makeApp({ session, queueConnection: redisConnection })

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
