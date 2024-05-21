import { LogoutController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'
import { JwtTokenEncryption } from '@/infra/encryption'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeLogoutController = (
  session: ClientSession
): LogoutController => {
  const mongoSession = mongoSessionFactory(session)
  const tokenRepository = new TokenMongoRepository(session)
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const tokenManager = new TokenManager(tokenRepository, jwtManager)

  return new LogoutController(tokenManager, mongoSession)
}
