import type { Hash } from '@/data/usecases'
import { UserMongoRepository } from '@/infra/db/mongodb/repos/user-repository'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { ObjectId } from 'mongodb'
import { UserModel } from '@/domain/models'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const makeHashStub = (): Hash.Generate => {
  class HashStub implements Hash.Generate {
    async generate(value: string): Promise<string> {
      return value
    }
  }

  return new HashStub()
}

const makeSut = (): {
  sut: UserMongoRepository
  hashStub: Hash.Generate
} => {
  const hashStub = makeHashStub()
  const sut = new UserMongoRepository(hashStub)

  return {
    sut,
    hashStub
  }
}

describe('UserMongoRepository', () => {
  let mongoServer: MongoMemoryServer

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterEach(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  describe('add', () => {
    it('should add a new user and return the user id', async () => {
      const { sut } = makeSut()

      const result = await sut.add({
        username: 'test_user1',
        email: 'test_user1@example.com',
        password: 'password'
      })

      expect(result.id).toBeTruthy()
    })

    it('should add a new user with user level if no level is provided', async () => {
      const { sut } = makeSut()

      const user = {
        username: 'test_user2',
        email: 'test_user2@example.com',
        password: 'password'
      }

      await UserSchema.create(user)

      const result = await sut.findByEmail('test_user2@example.com')

      expect(result?.level).toEqual('user')
    })

    it('should add a new user with user level if user level is provided', async () => {
      const { sut } = makeSut()

      await UserSchema.create({
        username: 'test_user3',
        email: 'test_user3@example.com',
        password: 'password',
        level: UserModel.Level.USER
      })

      const result = await sut.findByEmail('test_user3@example.com')

      expect(result?.level).toEqual('user')
    })

    it('should add a new user with admin level if admin level is provided', async () => {
      const { sut } = makeSut()

      await UserSchema.create({
        username: 'admin_user',
        email: 'admin_user@example.com',
        password: 'password',
        level: UserModel.Level.ADMIN
      })

      const result = await sut.findByEmail('admin_user@example.com')

      expect(result?.level).toEqual('admin')
    })
  })

  describe('findByEmail', () => {
    it('should return null if no user is found with the given email', async () => {
      const { sut } = makeSut()

      const result = await sut.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })

    it('should return the user if found with the given email', async () => {
      const { sut } = makeSut()

      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      }

      await UserSchema.create(user)

      const result = await sut.findByEmail('test@example.com')

      expect(result).toEqual(expect.objectContaining(user))
    })
  })

  describe('findByUsername', () => {
    it('should return null if no user is found with the given username', async () => {
      const { sut } = makeSut()

      const result = await sut.findByUsername('nonexistent')

      expect(result).toBeNull()
    })

    it('should return the user if found with the given username', async () => {
      const { sut } = makeSut()

      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      }

      await UserSchema.create(user)

      const result = await sut.findByUsername('testuser')

      expect(result).toEqual(expect.objectContaining(user))
    })
  })

  describe('findByUserId', () => {
    it('should return null if no user is found with the given user id', async () => {
      const { sut } = makeSut()
      const result = await sut.findByUserId(
        new ObjectId('507f1f77bcf86cd799439011').toString()
      )

      expect(result).toBeNull()
    })

    it('should return the user if found with the given user id', async () => {
      const { sut } = makeSut()

      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      }

      const data = await UserSchema.create(user)

      const result = await sut.findByUserId(data._id.toString())

      expect(data.id).toHaveLength(24)
      expect(result).toEqual(expect.objectContaining(user))
    })
  })
})
