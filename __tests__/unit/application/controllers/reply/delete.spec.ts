import { DeleteReplyController } from '@/application/controllers/reply'
import { ValidationComposite } from '@/application/validation'
import type { Reply } from '@/data/usecases/'

import { ReplyStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: DeleteReplyController
  replyManager: Reply.Delete
}

const makeSut = (): SutTypes => {
  const replyManager = new ReplyStub()

  return {
    sut: new DeleteReplyController(replyManager),
    replyManager
  }
}

describe('Delete Reply Controller', () => {
  it('should call delete with correct params', async () => {
    const { sut, replyManager } = makeSut()
    const deleteSpy = jest.spyOn(replyManager, 'delete')

    await sut.handle({
      replyId: 'any_reply',
      userId: 'any_user_id'
    })

    expect(deleteSpy).toHaveBeenCalledWith({
      replyId: 'any_reply',
      userId: 'any_user_id'
    })
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      replyId: 'any_reply',
      userId: 'any_user_id'
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 500 if delete throws', async () => {
    const { sut, replyManager } = makeSut()
    jest.spyOn(replyManager, 'delete').mockRejectedValueOnce(new Error())

    const response = await sut.handle({
      replyId: 'any_reply',
      userId: 'any_user_id'
    })

    expect(response).toEqual({
      statusCode: 500,
      error: 'Internal server error'
    })
  })

  it('should call ValidationComposite with correct values', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    const spy = jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      replyId: 'any_reply',
      userId: 'any_user_id'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })

    expect(spy).toHaveBeenCalledWith([
      { value: 'any_user_id', fieldName: 'userId' },
      { value: 'any_reply', fieldName: 'replyId' }
    ])
  })
})
