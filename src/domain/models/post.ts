import type { UserModel } from './user'

export namespace PostModel {
  export interface Model {
    id: string
    user: UserModel.Model
    title: string
    content: string
  }
}
