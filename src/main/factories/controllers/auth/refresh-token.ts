import { RefreshTokenController } from '@/application/controllers/auth'
import { RefreshTokenService } from '@/data/services'
// import type { DataSource } from 'typeorm'

export const makeRefreshTokenController = (): RefreshTokenController => {
  const service = new RefreshTokenService()
  return new RefreshTokenController(service)
}
