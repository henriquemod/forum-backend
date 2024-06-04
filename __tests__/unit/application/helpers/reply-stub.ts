import type { Reply } from '@/data/usecases/'
import type { ReplyModel } from '@/domain/models'

import { MOCK_REPLY } from '../../data/helpers'

export class ReplyStub
  implements Reply.ReplyPost, Reply.Delete, Reply.FindById, Reply.Update
{
  async findById(_params: Reply.FindByIdParams): Promise<ReplyModel.Model> {
    return MOCK_REPLY
  }

  async update(_params: Reply.UpdateParams): Promise<void> {}
  async delete(_params: Reply.DeleteParams): Promise<void> {}
  async reply(_params: Reply.ReplyPostParams): Promise<void> {}
}
