export namespace TokenValidator {
  export type Params = string
  export type Result = boolean
}

export interface JWTTokenValidator {
  validate: (token: TokenValidator.Params) => Promise<TokenValidator.Result>
}
