import type { Token, User } from '@/domain/models'

export namespace SignInToken {
  export type Params = User
  export type Result = Omit<Token, 'invalid'>
}

export interface SignInToken {
  signIn: (user: SignInToken.Params) => Promise<SignInToken.Result>
}
