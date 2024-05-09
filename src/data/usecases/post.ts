import type { PostModel, UserModel } from '@/domain/models'

export namespace Post {
  export type Origin = 'username' | 'email'

  export interface CreateResult {
    id: string
  }

  export interface Get {
    getUser: (value: string, origin?: Origin) => Promise<UserModel.Model>
  }

  export type CreateParams = Omit<PostModel.Model, 'id' | 'user'> & {
    user: string
  }

  export interface CreatePost {
    createPost: (params: CreateParams) => Promise<CreateResult>
  }
}
