export interface SaveToken {
  save: (account: SaveToken.Params) => Promise<SaveToken.Result>
}

export namespace SaveToken {
  export interface Params {
    email: string
    token: string
  }

  export type Result = undefined
}
