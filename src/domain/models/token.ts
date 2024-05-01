import type { AccessTokenModel } from './access-token'
import type { UserModel } from './user'

export interface TokenModel {
  accessToken: AccessTokenModel
  refreshAccessToken: AccessTokenModel
  invalid: boolean
  user: UserModel.Model
}
