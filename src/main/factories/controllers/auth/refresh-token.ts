import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/usecases/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'
import { JWTEncryption } from '@/infra/encryption'

export const makeRefreshTokenController = (): RefreshTokenController => {
  return new RefreshTokenController(
    new TokenManager(new TokenMongoRepository(), new JWTEncryption())
  )
}
