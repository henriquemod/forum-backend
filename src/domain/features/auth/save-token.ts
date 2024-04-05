export interface SaveToken {
  add: (account: SaveToken.Params) => Promise<SaveToken.Result>
}

export namespace SaveToken {
  export interface Params {
    token: string
    userId: string
  }

  export type Result = undefined
}
