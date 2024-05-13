import { CreatePostController } from '@/application/controllers/post'
import { ValidationComposite } from '@/application/validation'
import type { Post } from '@/data/usecases/'
import { PostStub } from '../../helpers'
import { omit } from 'ramda'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: CreatePostController
  postManager: Post.CreatePost
}

const makeSut = (): SutTypes => {
  const postManager = new PostStub()

  return {
    sut: new CreatePostController(postManager),
    postManager
  }
}

const MOCK_BODY = {
  title: 'any_title',
  content: 'any_content',
  userId: 'any_user_id'
}

describe('Create Post Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(MOCK_BODY)

    expect(res).toMatchObject({
      statusCode: 200,
      data: {
        id: 'any_id'
      }
    })
  })

  it('should return statusCode 500 if createPost throws', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'createPost').mockRejectedValueOnce(new Error())

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['title'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no content is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['content'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no userId is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['userId'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })
})
