import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
// import { makePgDatasource } from './factories/repos/pg-datasource'

const start = async (): Promise<void> => {
  // const datasource = makePgDatasource()
  // const db = await datasource.initialize()
  const app = makeApp()

  app.listen(env.appPort, () => {
    console.log(`Server is running at http://localhost:${env.appPort}`)
  })
}

start().catch(console.error)
