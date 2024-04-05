import type { RegisterError } from '../../errors'

export interface Register {
  perform: (params: Register.Params) => Promise<Register.Result>
}

export namespace Register {
  export interface Params {
    username: string
    password: string
    email: string
  }

  export type Result =
    | {
        id: string
      }
    | RegisterError
}
