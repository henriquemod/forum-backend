import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenValidator } from '@/infra/encryption/jwt'

export const makeRefreshTokenController = (): RefreshTokenController => {
  return new RefreshTokenController(new TokenValidator())
}
