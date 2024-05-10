import type { PostModel } from '@/domain/models'

export namespace DBPost {
  export interface AddParams {
    userId: string
    title: string
    content: string
  }

  export interface UpdateParams {
    id: string
    updateContent: Partial<Omit<AddParams, 'userId'>>
  }

  export interface AddResult {
    id: string
  }

  export interface Create {
    create: (params: AddParams) => Promise<AddResult>
  }

  export interface Delete {
    delete: (id: string) => Promise<void>
  }

  export interface Update {
    update: (params: UpdateParams) => Promise<void>
  }

  export interface FindById {
    findById: (id: string) => Promise<PostModel.Model | null>
  }

  export interface FindAll {
    findAll: () => Promise<PostModel.Model[]>
  }

  export interface FindByUserId {
    findByUserId: (userId: string) => Promise<PostModel.Model[]>
  }
}
