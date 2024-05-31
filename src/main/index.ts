/* eslint-disable no-console */
import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import { databaseInit } from './config/database'

const start = async (): Promise<void> => {
  const session = await databaseInit()
  const app = makeApp(session)

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
