import { NotFound } from '@/application/errors'
import { TokenManager } from '@/data/protocols'
import type { Token } from '@/data/usecases'
import type { User } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db/token'
import type { DBUser } from '@/domain/usecases/db/user'

type DBTokenStub = DBToken.Find & DBToken.Delete & DBToken.Add
type DBUserStub = DBUser.Find
type JWTStub = Token.SignIn

interface SutTypes {
  sut: TokenManager
  tokenRepositoryStub: DBTokenStub
  userRepositoryStub: DBUserStub
  jwtManagerStub: JWTStub
}

class TokenRepositoryStub implements DBTokenStub {
  async findByToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    return await Promise.resolve({
      accessToken: 'any_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      }
    })
  }

  async findByRefreshToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: string): Promise<DBToken.FindResult | null> {
    return await Promise.resolve({
      accessToken: 'any_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      }
    })
  }

  async delete(accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async add(params: DBToken.AddParams): Promise<void> {
    await Promise.resolve()
  }
}

class UserRepositoryStub implements DBUserStub {
  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByUsername(username: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: string): Promise<User | null> {
    return await Promise.resolve({
      id: 'any_id',
      email: 'any_email',
      username: 'any_username',
      password: 'any_hashed_password'
    })
  }
}

class JWTManagerStub implements JWTStub {
  async signIn(user: User): Promise<Token.SignResult> {
    return await Promise.resolve({
      accessToken: 'any_token',
      refreshAccessToken: 'any_token',
      userId: 'any_id'
    })
  }
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

      expect(deleteSpy).toHaveBeenCalledWith('any_token')
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

      await sut.signIn({
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      })

      expect(findByUserIdSpy).toHaveBeenCalledWith('any_id')
    })

    it('should call delete with correct values if user has token', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest.spyOn(tokenRepositoryStub, 'findByUserId').mockResolvedValueOnce({
        accessToken: 'any_token',
        user: {
          id: 'any_id',
          email: 'any_email',
          username: 'any_username',
          password: 'any_hashed_password'
        }
      })
      const deleteSpy = jest.spyOn(tokenRepositoryStub, 'delete')

      await sut.signIn({
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      })

      expect(deleteSpy).toHaveBeenCalledWith('any_token')
    })

    it('should throw if findByUserId throws', async () => {
      const { sut, tokenRepositoryStub } = makeSut()
      jest
        .spyOn(tokenRepositoryStub, 'findByUserId')
        .mockRejectedValueOnce(new Error())

      const promise = sut.signIn({
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      })

      await expect(promise).rejects.toThrow()
    })

    it('should throw if findByUserId returns null', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const promise = sut.signIn({
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      })

      await expect(promise).rejects.toThrow(NotFound)
    })

    it('should call findByUserId with correct values', async () => {
      const { sut, userRepositoryStub } = makeSut()
      const findByUserIdSpy = jest.spyOn(userRepositoryStub, 'findByUserId')

      await sut.signIn({
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_hashed_password'
      })

      expect(findByUserIdSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
