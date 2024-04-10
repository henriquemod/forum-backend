import type { AccessToken } from './access-token'
import type { User } from './user'

export interface Token {
  accessToken: AccessToken
  refreshAccessToken: AccessToken
  invalid: boolean
  user: User
}
