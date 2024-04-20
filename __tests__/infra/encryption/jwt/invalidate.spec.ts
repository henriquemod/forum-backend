import { JWTEncryption } from '@/infra/encryption'
import { UserRepositoryStub } from '../stubs'

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

describe('JWTEncryption - Invalidate', () => {
  it('should call delete with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const mockAccessToken = 'any_access_token'

    const deleteSpy = jest.spyOn(userRepositoryStub, 'delete')

    await sut.invalidate(mockAccessToken)

    expect(deleteSpy).toHaveBeenCalledWith(mockAccessToken)
  })

  it('should throw if userRepository throws', async () => {
    const { sut, userRepositoryStub } = makeSut()

    jest.spyOn(userRepositoryStub, 'delete').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.invalidate('any_access_token')

    await expect(promise).rejects.toThrow()
  })
})
