import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Reply } from '@/data/usecases'
import type { ReplyModel } from '@/domain/models'
import { type Validator, ValidationBuilder as builder } from '../../validation'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { Session } from '@/application/protocols/session'

type ReplyManager = Reply.Update
type PerformParams = AuthenticatedRequest<Reply.UpdateParams>

export class UpdateReplyController extends Controller {
  constructor(
    private readonly replyManager: ReplyManager,
    protected readonly session?: Session
  ) {
    super(session)
  }

  async perform({
    userId,
    replyId,
    content
  }: PerformParams): Promise<HttpResponse<ReplyModel.Model>> {
    await this.replyManager.update({ userId, replyId, content })

    return noContent()
  }

  override buildValidators({
    userId,
    replyId,
    content
  }: PerformParams): Validator[] {
    return [
      ...builder
        .of({
          value: userId,
          fieldName: 'userId'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: replyId,
          fieldName: 'replyId'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: content,
          fieldName: 'content'
        })
        .required()
        .build()
    ]
  }
}
