import type { Hash } from '@/data/usecases'
import { UserMongoRepository } from '@/infra/db/mongodb/repos/user-repository'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { ObjectId } from 'mongodb'
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

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  describe('add', () => {
    it('should add a new user and return the user id', async () => {
      const { sut } = makeSut()

      const user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      }

      const result = await sut.add(user)

      expect(result.id).toBeTruthy()
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
