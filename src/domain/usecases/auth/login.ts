export interface Login {
  login: (account: Login.Params) => Promise<Login.Result>
}

export namespace Login {
  export interface Params {
    username: string
    password: string
  }

  export interface Result {
    userId: string
    accessToken: string
    refreshAccessToken: string
  }
}
