import { RefreshTokenController } from '@/application/controllers/auth'
import type { Token } from '@/data/usecases/'
import { TokenStub } from '../helpers'

interface SutTypes {
  sut: RefreshTokenController
  tokenManager: Token.Refresh
}

const makeSut = (): SutTypes => {
  const tokenManager = new TokenStub()

  return {
    sut: new RefreshTokenController(tokenManager),
    tokenManager
  }
}

describe('RefreshToken Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({ accessToken: 'any_refresh_access_token' })

    expect(res).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'new_access_token',
        accessRefreshToken: 'new_refresh_token'
      }
    })
  })

  it('should return statusCode 400 if no refresh token is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({})

    expect(res.statusCode).toBe(400)
  })

  it('should return statusCode 500 if token manager throws', async () => {
    const { sut, tokenManager } = makeSut()

    jest.spyOn(tokenManager, 'refresh').mockRejectedValueOnce(new Error())

    const res = await sut.handle({ accessToken: 'any_refresh_access_token' })

    expect(res.statusCode).toBe(500)
  })
})
