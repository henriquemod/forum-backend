import { JwtTokenEncryption } from '@/infra/encryption'
import { UserRepositoryStub } from '../stubs'

interface SutTypes {
  sut: JwtTokenEncryption
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new JwtTokenEncryption(userRepositoryStub)

  return {
    sut,
    userRepositoryStub
  }
}

describe('JWTEncryption - UserHasToken', () => {
  it('should return true if user has token', async () => {
    const { sut } = makeSut()

    const res = await sut.userHasToken('any_user_id')

    expect(res).toBe(true)
  })

  it('should return false if user does not have token', async () => {
    const { sut, userRepositoryStub } = makeSut()

    jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

    const res = await sut.userHasToken('any_user_id')

    expect(res).toBe(false)
  })

  it('should call findByUserId with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const mockUserId = 'any_user_id'

    const findByUserIdSpy = jest.spyOn(userRepositoryStub, 'findByUserId')

    await sut.userHasToken(mockUserId)

    expect(findByUserIdSpy).toHaveBeenCalledWith(mockUserId)
  })

  it('should throw if userRepository throws', async () => {
    const { sut, userRepositoryStub } = makeSut()

    jest
      .spyOn(userRepositoryStub, 'findByUserId')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const promise = sut.userHasToken('any_user_id')

    await expect(promise).rejects.toThrow()
  })
})
