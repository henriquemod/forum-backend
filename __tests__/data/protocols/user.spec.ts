import { UserManager } from '@/data/protocols'
import type { User } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db/user'

type DBUserStub = DBUser.Find & DBUser.Add

class UserRepositoryStub implements DBUserStub {
  async findByEmail(email: string): Promise<User | null> {
    return await Promise.resolve({
      email: 'any_email',
      id: 'any_id',
      password: 'any_password',
      username: 'any_username'
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return await Promise.resolve({
      email: 'any_email',
      id: 'any_id',
      password: 'any_password',
      username: 'any_username'
    })
  }

  async findByUserId(userId: string): Promise<User | null> {
    return await Promise.resolve({
      email: 'any_email',
      id: 'any_id',
      password: 'any_password',
      username: 'any_username'
    })
  }

  async add(user: Omit<User, 'id'>): Promise<DBUser.AddResult> {
    return await Promise.resolve({ id: 'any_id' })
  }
}

interface SutTypes {
  sut: UserManager
  userRepositoryStub: DBUserStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new UserManager(userRepositoryStub)

  return {
    sut,
    userRepositoryStub
  }
}

describe('UserManager', () => {
  describe('registerUser', () => {
    it('should return user id on success', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const res = await sut.registerUser({
        email: 'any_email',
        password: 'any_password',
        username: 'any_username'
      })

      expect(res).toEqual({ id: 'any_id' })
    })

    it('should throw BadRequest if email already exist', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.registerUser({
        email: 'any_email',
        password: 'any_password',
        username: 'any_username'
      })

      expect(promise).rejects.toThrow('Username or email already in use')
    })

    it('should throw BadRequest if username already exist', () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.registerUser({
        email: 'any_email',
        password: 'any_password',
        username: 'any_username'
      })

      expect(promise).rejects.toThrow('Username or email already in use')
    })

    it('should throw BadRequest if both email and username already exist', () => {
      const { sut } = makeSut()

      const promise = sut.registerUser({
        email: 'any_email',
        password: 'any_password',
        username: 'any_username'
      })

      expect(promise).rejects.toThrow('Username or email already in use')
    })
  })

  describe('getUser', () => {
    it('should return user on success from default origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser('any_username')

      expect(res).toEqual({
        email: 'any_email',
        id: 'any_id',
        password: 'any_password',
        username: 'any_username'
      })
    })

    it('should return user on success from email origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser('any_email', 'email')

      expect(res).toEqual({
        email: 'any_email',
        id: 'any_id',
        password: 'any_password',
        username: 'any_username'
      })
    })
    it('should throw NotFound if user not found from email origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)

      const promise = sut.getUser('any_email', 'email')

      expect(promise).rejects.toThrow('User not found')
    })
    it('should return user on success from username origin', async () => {
      const { sut } = makeSut()

      const res = await sut.getUser('any_username', 'username')

      expect(res).toEqual({
        email: 'any_email',
        id: 'any_id',
        password: 'any_password',
        username: 'any_username'
      })
    })

    it('should throw NotFound if user not found from username origin', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest
        .spyOn(userRepositoryStub, 'findByUsername')
        .mockResolvedValueOnce(null)

      const promise = sut.getUser('any_username', 'username')

      expect(promise).rejects.toThrow('User not found')
    })
  })
})
