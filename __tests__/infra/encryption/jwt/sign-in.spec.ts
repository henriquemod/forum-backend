import { JWTEncryption } from '@/infra/encryption'
import { UserRepositoryStub } from '../stubs'
import '@/main/config/env'
import jwt from 'jsonwebtoken'
import { UserModel } from '@/domain/models'

jest.mock('jsonwebtoken')
jest.mock('@/main/config/env', () => ({
  env: {
    jwtSecret: 'any_token_secret',
    refreshTokenSecret: 'any_refresh_token_secret'
  }
}))

interface SutTypes {
  sut: JWTEncryption
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new JWTEncryption(userRepositoryStub)

  return {
    sut,
    userRepositoryStub
  }
}

describe('JWTEncryption - SignIn', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  const mockUser = {
    id: 'any_id',
    username: 'any_username',
    password: 'any_password',
    email: 'any_email',
    level: UserModel.Level.USER
  }

  it('should return new access token on success', async () => {
    const { sut } = makeSut()

    jest
      .spyOn(jwt, 'sign')
      .mockImplementationOnce(() => 'any_access_token')
      .mockImplementationOnce(() => 'any_refresh_token')

    const res = await sut.signIn(mockUser)

    expect(res).toEqual({
      accessToken: 'any_access_token',
      refreshAccessToken: 'any_refresh_token',
      userId: 'any_id'
    })
  })

  it('should call jwt with correct values', async () => {
    const { sut } = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.signIn(mockUser)

    expect(signSpy).toHaveBeenCalledWith(
      { id: 'any_id', username: 'any_username' },
      'any_token_secret',
      { expiresIn: '3h' }
    )

    expect(signSpy).toHaveBeenCalledWith(
      { id: 'any_id', username: 'any_username' },
      'any_refresh_token_secret',
      { expiresIn: '3d' }
    )
  })

  it('should throw if accessToken sign throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.signIn(mockUser)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if refreshToken sign throws', async () => {
    const { sut } = makeSut()

    jest
      .spyOn(jwt, 'sign')
      .mockImplementationOnce(() => 'any_access_token')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const promise = sut.signIn(mockUser)

    await expect(promise).rejects.toThrow()
  })
})
