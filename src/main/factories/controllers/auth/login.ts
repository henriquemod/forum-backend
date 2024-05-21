import { LoginController } from '@/application/controllers/auth'
import { TokenManager, UserManager } from '@/data/protocols'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JwtTokenEncryption } from '@/infra/encryption'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeLoginController = (
  session: ClientSession
): LoginController => {
  const mongoSession = mongoSessionFactory(session)
  const hash = new BCryptHash()
  const userRepository = new UserMongoRepository(hash, session)
  const tokenRepository = new TokenMongoRepository(session)
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const userManagement = new UserManager(userRepository)
  const tokenManager = new TokenManager(tokenRepository, jwtManager)

  return new LoginController(userManagement, tokenManager, hash, mongoSession)
}
