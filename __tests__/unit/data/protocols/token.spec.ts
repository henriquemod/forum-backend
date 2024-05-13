import { NotFound } from '@/application/errors'
import { TokenManager } from '@/data/protocols'
import {
  type DBTokenStub,
  type DBUserStub,
  type JWTStub,
  JWTManagerStub,
  MOCK_ACCESS_TOKEN,
  MOCK_USER,
  TokenRepositoryStub,
  UserRepositoryStub
} from '../helpers'

interface SutTypes {
  sut: TokenManager
  tokenRepositoryStub: DBTokenStub
  userRepositoryStub: DBUserStub
  jwtManagerStub: JWTStub
}

const makeSut = (): SutTypes => {
  const tokenRepositoryStub = new TokenRepositoryStub()
  const jwtManagerStub = new JWTManagerStub()
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new TokenManager(
    tokenRepositoryStub,
    userRepositoryStub,
    jwtManagerStub
  )

  return {
    sut,
    tokenRepositoryStub,
    userRepositoryStub,
    jwtManagerStub
  }
}

describe('TokenManager', () => {
  describe('getToken', () => {
    it('should return token model on success', async () => {
      const { sut } = makeSut()

      const res = await sut.getToken('any_token')

      expect(res).toEqual(MOCK_ACCESS_TOKEN)
    })

    it('should return statusCode 404 when no token were found', () => {
      const { sut, tokenRepositoryStub } = makeSut()

      jest.spyOn(tokenRepositoryStub, 'findByToken').mockResolvedValueOnce(null)

      const promise = sut.getToken('any_token')

      expect(promise).rejects.toThrow(NotFound)
    })
  })
  describe('userHasToken', () => {
    it('should return true if user has token available', async () => {
      const { sut } = makeSut()

      const res = await sut.userHasToken('any_user_id')

      expect(res).toBe(true)
    })

    it('should return false if user has no token available', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(null)

      const res = await sut.userHasToken('any_user_id')

      expect(res).toBe(false)
    })

    it('should throw if findByUserId throws', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByUserId')
        .mockRejectedValueOnce(new Error())

      const promise = sut.userHasToken('any_user_id')

      await expect(promise).rejects.toThrow()
    })
  })
  describe('validate', () => {
    it('should return true if user has token available', async () => {
      const { sut } = makeSut()

      const res = await sut.validate('any_token')

      expect(res).toBe(true)
    })

    it('should return false if user has no token available', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest.spyOn(tokenRepositoryStub, 'findByToken').mockResolvedValueOnce(null)

      const res = await sut.validate('any_token')

      expect(res).toBe(false)
    })

    it('should throw if findByUserId throws', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByToken')
        .mockRejectedValueOnce(new Error())

      const promise = sut.validate('any_token')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('refresh', () => {
    it('should return a new token if token is found', async () => {
      const { sut } = makeSut()

      const res = await sut.refresh('any_token')

      expect(res).toEqual({
        accessToken: 'any_token',
        accessRefreshToken: 'any_token'
      })
    })

    it('should throw if token is not found', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest.spyOn(tokenRepositoryStub, 'findByToken').mockResolvedValueOnce(null)

      const promise = sut.refresh('any_token')

      await expect(promise).rejects.toThrow(NotFound)
    })

    it('should throw if signIn throws', async () => {
      const { sut, jwtManagerStub } = makeSut()
      jest.spyOn(jwtManagerStub, 'signIn').mockRejectedValueOnce(new Error())

      const promise = sut.refresh('any_token')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('invalidate', () => {
    it('should call delete with correct values', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      const deleteSpy = jest.spyOn(tokenRepositoryStub, 'delete')

      await sut.invalidate('any_token')

      expect(deleteSpy).toHaveBeenCalledWith(MOCK_ACCESS_TOKEN.accessToken)
    })

    it('should throw if delete throws', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'delete')
        .mockRejectedValueOnce(new Error())

      const promise = sut.invalidate('any_token')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('signIn', () => {
    it('should call findByUserId with correct values', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      const findByUserIdSpy = jest.spyOn(tokenRepositoryStub, 'findByUserId')

      await sut.signIn(MOCK_USER)

      expect(findByUserIdSpy).toHaveBeenCalledWith(MOCK_USER.id)
    })

    it('should call delete with correct values if user has token', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByUserId')
        .mockResolvedValueOnce(MOCK_ACCESS_TOKEN)
      const deleteSpy = jest.spyOn(tokenRepositoryStub, 'delete')

      await sut.signIn(MOCK_USER)

      expect(deleteSpy).toHaveBeenCalledWith(MOCK_ACCESS_TOKEN.accessToken)
    })

    it('should throw if findByUserId throws', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByUserId')
        .mockRejectedValueOnce(new Error())

      const promise = sut.signIn(MOCK_USER)

      await expect(promise).rejects.toThrow()
    })

    it('should throw if findByUserId returns null', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const promise = sut.signIn(MOCK_USER)

      await expect(promise).rejects.toThrow(NotFound)
    })

    it('should call findByUserId with correct values', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const findByUserIdSpy = jest.spyOn(userRepositoryStub, 'findByUserId')

      await sut.signIn(MOCK_USER)

      expect(findByUserIdSpy).toHaveBeenCalledWith(MOCK_USER.id)
    })
  })
})
