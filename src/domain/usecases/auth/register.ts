export interface Register {
  register: (params: Register.Params) => Promise<Register.Result>
}

export namespace Register {
  export interface Params {
    username: string
    password: string
    email: string
  }

  export interface Result {
    id: string
  }
}
