import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { PostSchema, ReplySchema, UserSchema } from '@/infra/db/mongodb/schemas'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { MOCK_POST, MOCK_USER } from '../../data/helpers'
import type { PostModel, UserModel } from '@/domain/models'

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
  let user: UserModel.SafeModel
  let post: PostModel.Model

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())

    const newUser = new UserSchema(USER)
    await newUser.save()
    user = UserMongoRepository.makeDTO(newUser, true)

    const newPost = new PostSchema(POST)
    await newPost.save()
    post = PostMongoRepository.makeDTO(newPost)
  })

  afterEach(async () => {
    await ReplySchema.deleteMany({})
    await PostSchema.deleteMany({})
    await UserSchema.deleteMany({})
    await mongoose.disconnect()
    mongoServer.stop()
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    const replyParams = {
      user,
      content: 'any_content',
      post,
      parentReply: null
    }

    it('should create a new reply and return the reply model', async () => {
      const { sut } = makeSut()

      const result = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      expect(result).toBeTruthy()
      expect(result.content).toBe(replyParams.content)
      expect(result.user).toMatchObject(user)
      expect(result.post).toMatchObject(post)
    })

    it('should add the reply to the post replies array', async () => {
      const { sut } = makeSut()

      const reply = await sut.create({
        user,
        content: 'any_content',
        post,
        parentReply: null
      })

      const postRepo = new PostMongoRepository()

      const findPost = await postRepo.findById(post.id)
      expect(findPost?.replies).toHaveLength(1)
      expect(findPost?.replies?.[0].content).toBe(reply.content)
    })

    it('should throw if findByIdAndUpdate throws', () => {
      const { sut } = makeSut()

      jest.spyOn(PostSchema, 'findByIdAndUpdate').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })

    it('should throw if save throws', () => {
      const { sut } = makeSut()

      jest.spyOn(ReplySchema.prototype, 'save').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.create(replyParams)

      expect(promise).rejects.toThrow()
    })
  })
})
