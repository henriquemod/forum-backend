import type { User } from './user'

export interface Token {
  accessToken: string
  refreshAccessToken: string
  invalid: boolean
  user: User
}
