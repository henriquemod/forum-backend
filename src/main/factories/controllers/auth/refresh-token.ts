import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/usecases/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'

export const makeRefreshTokenController = (): RefreshTokenController => {
  return new RefreshTokenController(
    new TokenManager(new TokenMongoRepository())
  )
}
