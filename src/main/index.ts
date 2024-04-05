import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import { MongoHelper } from '@/infra/db/mongodb'
// import { makePgDatasource } from './factories/repos/pg-datasource'

const start = async (): Promise<void> => {
  await MongoHelper.connect(env.mongoUrl)

  const app = makeApp()

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
