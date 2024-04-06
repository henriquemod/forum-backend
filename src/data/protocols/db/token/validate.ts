export namespace TokenValidate {
  export type Params = string
  export type Result = boolean
}

export interface TokenValidate {
  validate: (token: TokenValidate.Params) => Promise<TokenValidate.Result>
}
