import { TokenMongoRepository } from '@/infra/db/mongodb'
// import type { DataSource } from 'typeorm'

export const makeTokenRepository = (): TokenMongoRepository => {
  return new TokenMongoRepository()
}
