import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/usecases/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JWTEncryption } from '@/infra/encryption'

export const makeRefreshTokenController = (): RefreshTokenController => {
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  return new RefreshTokenController(
    new TokenManager(
      tokenRepository,
      userRepository,
      new JWTEncryption(tokenRepository)
    )
  )
}
