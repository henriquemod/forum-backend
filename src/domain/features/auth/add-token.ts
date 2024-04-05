export interface AddToken {
  add: (account: AddToken.Params) => Promise<AddToken.Result>
}

export namespace AddToken {
  export interface Params {
    token: string
    userId: string
  }

  export type Result = undefined
}
