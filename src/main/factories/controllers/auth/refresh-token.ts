import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JWTEncryption } from '@/infra/encryption'

export const makeRefreshTokenController = (): RefreshTokenController => {
  const bCryptHashInfra = new BCryptHash()
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(bCryptHashInfra)
  const jwtManager = new JWTEncryption(tokenRepository)
  const tokenManager = new TokenManager(
    tokenRepository,
    userRepository,
    jwtManager
  )

  return new RefreshTokenController(tokenManager)
}
