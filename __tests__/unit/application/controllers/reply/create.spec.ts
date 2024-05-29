import { CreateReplyController } from '@/application/controllers/reply'
import type { Reply } from '@/data/usecases/'
import { ReplyStub } from '../../helpers'
import { ValidationComposite } from '@/application/validation'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: CreateReplyController
  replyManager: Reply.ReplyPost
}

const makeSut = (): SutTypes => {
  const replyManager = new ReplyStub()

  return {
    sut: new CreateReplyController(replyManager),
    replyManager
  }
}

describe('Create Reply Controller', () => {
  it('should call reply with correct params', async () => {
    const { sut, replyManager } = makeSut()
    const replySpy = jest.spyOn(replyManager, 'reply')

    await sut.perform({
      postId: 'any_post_id',
      userId: 'any_user_id',
      content: 'any_content'
    })

    expect(replySpy).toHaveBeenCalledWith({
      postId: 'any_post_id',
      authorId: 'any_user_id',
      content: 'any_content'
    })
  })

  it('should return noContent on success', async () => {
    const { sut } = makeSut()

    const response = await sut.perform({
      postId: 'any_post_id',
      userId: 'any_user_id',
      content: 'any_content'
    })

    expect(response).toEqual({ statusCode: 204, data: null })
  })

  it('should throw if reply throws', async () => {
    const { sut, replyManager } = makeSut()
    jest.spyOn(replyManager, 'reply').mockRejectedValueOnce(new Error())

    const promise = sut.perform({
      postId: 'any_post_id',
      userId: 'any_user_id',
      content: 'any_content'
    })

    await expect(promise).rejects.toThrow()
  })

  it('should return 400 if validate throws', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))

    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })
})
