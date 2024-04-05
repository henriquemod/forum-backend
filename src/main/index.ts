import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import mongoose from 'mongoose'

const start = async (): Promise<void> => {
  await mongoose.connect(env.mongoUrl)

  const app = makeApp()

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
