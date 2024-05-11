import { DeletePostController } from '@/application/controllers/post'
import { ValidationComposite } from '@/application/validation'
import type { Post, User } from '@/data/usecases/'
import { MOCK_POST, MOCK_USER, PostStub, UserStub } from '../../helpers'
import { UserModel } from '@/domain/models'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: DeletePostController
  postManager: Post.DeletePost & Post.FindPost
  userManager: User.FindUserByIdOrFail
}

const makeSut = (): SutTypes => {
  const postManager = new PostStub()
  const userManager = new UserStub()

  return {
    sut: new DeletePostController(postManager, userManager),
    postManager,
    userManager
  }
}

const MOCK_BODY = {
  id: 'any_id',
  userId: 'any_user_id'
}

describe('Delete Post Controller', () => {
  it('should return statusCode 204 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(204)
    // @ts-expect-error - Since statusCode is 204, data will exist on response object but it will be null
    expect(res.data).toBeNull()
  })

  it('should return statusCode 404 if post were not found', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'findPost').mockResolvedValueOnce(null)

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(404)
    // @ts-expect-error - Since statusCode is 404, error will exist on response object
    expect(res.error).toBe('Post not found')
  })

  it('should return statusCode 403 if user do not own the post', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'findPost').mockResolvedValueOnce({
      ...MOCK_POST,
      user: {
        ...MOCK_USER,
        id: 'other_id'
      }
    })

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(403)
    // @ts-expect-error - Since statusCode is 403, error will exist on response object
    expect(res.error).toBe('You are not allowed to delete this post')
  })

  it('should return statusCode 204 if user do not owns de post but is an admin', async () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'findUserByIdOrFail').mockResolvedValueOnce({
      ...MOCK_USER,
      id: 'other_id',
      level: UserModel.Level.ADMIN
    })

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(204)
    // @ts-expect-error - Since statusCode is 204, data will exist on response object but it will be null
    expect(res.data).toBeNull()
  })

  it('should return statusCode 500 if createPost throws', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'deletePost').mockRejectedValueOnce(new Error())

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(500)
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

    const httpResponse = await sut.handle(MOCK_BODY)

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
    expect(spy).toHaveBeenCalledWith([
      { value: 'any_id', fieldName: 'id' },
      { value: 'any_user_id', fieldName: 'userId' }
    ])
  })
})
