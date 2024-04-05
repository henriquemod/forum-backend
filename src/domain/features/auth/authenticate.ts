export interface Authenticate {
  login: (account: Authenticate.Params) => Promise<Authenticate.Result>
}

export namespace Authenticate {
  export interface Params {
    username: string
    password: string
  }

  export interface Result {
    token: string
    refreshToken: string
  }
}
