import { TokenMongoRepository } from '@/infra/db/mongodb/repos'

export const makeTokenRepository = (): TokenMongoRepository => {
  return new TokenMongoRepository()
}
