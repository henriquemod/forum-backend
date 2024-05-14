import type { PostModel } from '@/domain/models'
import type { DBPost } from '@/domain/usecases/db'
import { MOCK_POST } from '../../application/helpers'
import { pick } from 'ramda'

export type DBPostStub = DBPost.Create &
  DBPost.FindAll &
  DBPost.FindById &
  DBPost.Delete &
  DBPost.Update

export class PostRepositoryStub implements DBPostStub {
  async create(params: DBPost.AddParams): Promise<DBPost.AddResult> {
    return await Promise.resolve(pick(['id'], MOCK_POST))
  }

  async findAll(): Promise<PostModel.Model[]> {
    return await Promise.resolve([MOCK_POST])
  }

  async findById(id: string): Promise<PostModel.Model | null> {
    return await Promise.resolve(MOCK_POST)
  }

  async delete(id: string): Promise<void> {}

  async update(params: DBPost.UpdateParams): Promise<void> {}
}
