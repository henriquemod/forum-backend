import type { PostModel, UserModel } from '@/domain/models'

export namespace Post {
  export type Origin = 'username' | 'email'

  export interface CreateResult {
    id: string
  }

  export type FindAllResult = PostModel.Model[]

  export interface Get {
    getUser: (value: string, origin?: Origin) => Promise<UserModel.Model>
  }

  export type CreateParams = Omit<PostModel.Model, 'id' | 'user'> & {
    userId: string
  }

  export interface CreatePost {
    createPost: (params: CreateParams) => Promise<CreateResult>
  }

  export interface FindAll {
    findAll: () => Promise<FindAllResult>
  }
}
