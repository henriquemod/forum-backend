export namespace AddTokenRepository {
  export interface Params {
    userId: string
    token: string
  }
  export type Result = undefined
}

export interface AddTokenRepository {
  add: (data: AddTokenRepository.Params) => Promise<AddTokenRepository.Result>
}
