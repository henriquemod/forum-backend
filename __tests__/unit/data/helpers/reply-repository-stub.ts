import type { DBReply } from '@/domain/usecases/db'
import { MOCK_USER } from './user-repository-stub'
import type { PostModel, ReplyModel, UserModel } from '@/domain/models'
import { MOCK_POST } from './post-repository-stub'

export type DBReplyStub = DBReply.Create

const user: UserModel.Model = MOCK_USER
const post: PostModel.Model = MOCK_POST

export const MOCK_REPLY: ReplyModel.Model = {
  id: 'any_id',
  content: 'any_content',
  user,
  post,
  createdAt: new Date(),
  updatedAt: new Date()
}

export class ReplyRepositoryStub implements DBReplyStub {
  async create(params: DBReply.CreateParams): Promise<ReplyModel.Model> {
    return await Promise.resolve(MOCK_REPLY)
  }
}
