import type { UserModel } from '@/domain/models'
import { ActivationMongoRepository } from '@/infra/db/mongodb/repos/activation-repository'
import { ActivationSchema, UserSchema } from '@/infra/db/mongodb/schemas'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { MOCK_USER } from '../../data/helpers'

const MOCK_USER_ID = '123456789012345678901234'

interface SutTypes {
  sut: ActivationMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new ActivationMongoRepository()
  return {
    sut
  }
}

describe('ActivationMongoRepository', () => {
  let mongoServer: MongoMemoryServer
  let user: UserModel.Model

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
    const userData = new UserSchema({
      _id: new mongoose.Types.ObjectId(MOCK_USER_ID),
      ...MOCK_USER
    })
    const model = await userData.save()
    user = model
  })

  afterAll(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  beforeEach(async () => {
    await ActivationSchema.deleteMany({})
  })

  describe('create', () => {
    it('should create a new activation', async () => {
      const { sut } = makeSut()

      const activation = await sut.create({ userId: user.id })

      expect(activation.code).toBeTruthy()
      expect(activation.user).toBe(user.id)
    })
  })

  describe('findByCode', () => {
    it('should return the activation if found with the given code', async () => {
      const { sut } = makeSut()

      const data = await sut.create({
        userId: user.id
      })

      const result = await sut.findByCode(data.code)

      expect(result?.code).toBeTruthy()
      expect(result?.user.username).toBe(user.username)
      expect(result?.user.email).toBe(user.email)
    })

    it('should return null if no activation is found with the given code', async () => {
      const { sut } = makeSut()

      const result = await sut.findByCode('nonexistent_code')

      expect(result).toBeNull()
    })
  })
})
