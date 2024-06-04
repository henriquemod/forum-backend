import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'

import { MOCK_USER } from './user-repository-stub'

export const MOCK_POST: PostModel.Model = {
  id: 'any_id',
  user: MOCK_USER,
  title: 'any_title',
  content: 'any_content',
  createdAt: new Date(),
  updatedAt: new Date()
}

export type DBPostStub = DBPost.Create &
  DBPost.FindAll &
  DBPost.FindById &
  DBPost.Delete &
  DBPost.Update

export class PostRepositoryStub implements DBPostStub {
  async create(_params: DBPost.AddParams): Promise<PostModel.Model> {
    return await Promise.resolve(MOCK_POST)
  }

  async findAll(): Promise<PostModel.Model[]> {
    return await Promise.resolve([MOCK_POST])
  }

  async findById(_id: string): Promise<PostModel.Model | null> {
    return await Promise.resolve(MOCK_POST)
  }

  async delete(_id: string): Promise<void> {}

  async update(_params: DBPost.UpdateParams): Promise<void> {}
}
