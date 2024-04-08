export namespace TokenValidate {
  export type Params = string
  export type Result = boolean
}

export interface TokenValidate {
  validate: (accessToken: TokenValidate.Params) => Promise<TokenValidate.Result>
}

export namespace RefreshTokenValidate {
  export type Params = string
  export type Result = boolean
}

export interface RefreshTokenValidate {
  validateRefreshToken: (
    accessToken: RefreshTokenValidate.Params
  ) => Promise<RefreshTokenValidate.Result>
}
