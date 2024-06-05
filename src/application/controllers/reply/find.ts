import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Reply } from '@/data/usecases'
import type { ReplyModel } from '@/domain/models'

import { type Validator, ValidationBuilder as builder } from '../../validation'

type ReplyManager = Reply.FindById

export class FindReplyController extends Controller {
  constructor(private readonly replyManager: ReplyManager) {
    super()
  }

  async perform({
    replyId
  }: Reply.FindByIdParams): Promise<HttpResponse<ReplyModel.Model>> {
    const post = await this.replyManager.findById({ replyId })

    return ok(post)
  }

  override buildValidators({ replyId }: Reply.FindByIdParams): Validator[] {
    return [
      ...builder
        .of({
          value: replyId,
          fieldName: 'replyId'
        })
        .required()
        .build()
    ]
  }
}
