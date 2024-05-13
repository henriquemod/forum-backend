import type { PostModel } from '@/domain/models'

export namespace Post {
  type Model = Omit<PostModel.Model, 'user' | 'id'>
  export interface CreateResult {
    id: string
  }
  export type FindAllResult = PostModel.Model[]
  export type FindResult = PostModel.Model | null
  export type CreateParams = Model & {
    userId: string
  }
  export type UpdateParams = Partial<Model> & {
    id: string
  }
  export interface FindParams {
    id: string
  }

  export type DeleteParams = FindParams

  export interface CreatePost {
    createPost: (params: CreateParams) => Promise<CreateResult>
  }

  export interface FindAllPosts {
    findAllPosts: () => Promise<FindAllResult>
  }

  export interface FindPost {
    findPost: (params: FindParams) => Promise<FindResult>
  }

  export interface DeletePost {
    deletePost: (params: DeleteParams) => Promise<void>
  }

  export interface UpdatePost {
    updatePost: (params: UpdateParams) => Promise<void>
  }
}
