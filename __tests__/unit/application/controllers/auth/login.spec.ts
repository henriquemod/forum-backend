import { LoginController } from '@/application/controllers/auth'
import { ValidationComposite } from '@/application/validation'
import type { Hash, Token, User } from '@/data/usecases/'
import { HashStub, TokenStub, UserStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: LoginController
  userManager: User.Get
  tokenManager: Token.SignIn
  hashManager: Hash.Compare
}

const makeSut = (): SutTypes => {
  const userManager = new UserStub()
  const tokenManager = new TokenStub()
  const hashManager = new HashStub()

  return {
    sut: new LoginController(userManager, tokenManager, hashManager),
    userManager,
    tokenManager,
    hashManager
  }
}

describe('Login Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(200)
  })

  it('should throw 401 if hash compare fails', async () => {
    const { sut, hashManager } = makeSut()

    jest.spyOn(hashManager, 'compare').mockResolvedValueOnce(false)

    const response = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(response).toEqual({
      statusCode: 403,
      error: 'Invalid credentials'
    })
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      username: 'any_username'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      password: 'any_password'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return statusCode 500 if user manager throws', async () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'getUser').mockRejectedValueOnce(new Error())

    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(500)
  })

  it('should return statusCode 500 if token manager throws', async () => {
    const { sut, tokenManager } = makeSut()

    jest.spyOn(tokenManager, 'signIn').mockRejectedValueOnce(new Error())

    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(500)
  })

  it('should return statusCode 500 if hash manager throws', async () => {
    const { sut, hashManager } = makeSut()

    jest.spyOn(hashManager, 'compare').mockRejectedValueOnce(new Error())

    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(500)
  })
})
