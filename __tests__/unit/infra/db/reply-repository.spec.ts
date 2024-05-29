import { ReplyMongoRepository } from '@/infra/db/mongodb/repos'
import { PostSchema, ReplySchema, UserSchema } from '@/infra/db/mongodb/schemas'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { MOCK_POST, MOCK_USER } from '../../data/helpers'

const MOCK_USER_ID = '123456789012345678901234'
const MOCK_POST_ID = '123456789012345678901234'

const USER = {
  _id: new mongoose.Types.ObjectId(MOCK_USER_ID),
  ...MOCK_USER,
  id: MOCK_USER_ID
}

const POST = {
  _id: new mongoose.Types.ObjectId(MOCK_POST_ID),
  ...MOCK_POST,
  id: MOCK_POST_ID,
  user: USER
}

interface SutTypes {
  sut: ReplyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new ReplyMongoRepository()
  return {
    sut
  }
}

describe('ReplyMongoRepository', () => {
  let mongoServer: MongoMemoryServer

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    const user = new UserSchema(USER)
    await user.save()

    const post = new PostSchema(POST)
    await post.save()
  })

  afterEach(async () => {
    await mongoose.disconnect()
    mongoServer.stop()
  })

  describe('create', () => {
    const replyParams = {
      user: USER,
      content: 'any_content',
      post: POST
    }

    it('should create a new reply and return the reply model', async () => {
      const { sut } = makeSut()

      const result = await sut.create(replyParams)

      expect(result).toBeTruthy()
      expect(result.content).toBe(replyParams.content)
      expect(result.user).toEqual(replyParams.user._id)
      expect(result.post).toEqual(replyParams.post._id)
    })

    it('should throw if save throws', () => {
      const { sut } = makeSut()

      jest.spyOn(ReplySchema.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })

    it('should add the reply to the post replies array', async () => {
      const { sut } = makeSut()

      const reply = await sut.create(replyParams)

      const post = await PostSchema.findById(MOCK_POST_ID)
      expect(post?.replies?.[0].toString()).toContain(reply.id)
    })

    it('should throw if findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })
  })
})
