export interface AddUser {
  add: (user: AddUser.Params) => Promise<AddUser.Result>
}

export namespace AddUser {
  export interface Params {
    username: string
    email: string
    password: string
  }

  export interface Result {
    id: string
  }
}
