import { ReplyManager } from '@/data/protocols'
import { NotFound } from '@/application/errors'
import {
  type DBReplyStub,
  type DBPostStub,
  type DBUserStub,
  MOCK_REPLY,
  MOCK_POST,
  MOCK_USER,
  ReplyRepositoryStub,
  PostRepositoryStub,
  UserRepositoryStub
} from '../helpers'

interface SutTypes {
  sut: ReplyManager
  replyRepositoryStub: DBReplyStub
  postRepositoryStub: DBPostStub
  userRepositoryStub: DBUserStub
}

const makeSut = (): SutTypes => {
  const replyRepositoryStub = new ReplyRepositoryStub()
  const postRepositoryStub = new PostRepositoryStub()
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new ReplyManager(
    replyRepositoryStub,
    postRepositoryStub,
    userRepositoryStub
  )

  return {
    sut,
    replyRepositoryStub,
    postRepositoryStub,
    userRepositoryStub
  }
}

describe('ReplyManager', () => {
  describe('reply', () => {
    const replyParams = {
      authorId: MOCK_USER.id,
      content: MOCK_REPLY.content,
      postId: MOCK_POST.id
    }

    it('should create reply on success', async () => {
      const { sut, replyRepositoryStub } = makeSut()

      const spy = jest.spyOn(replyRepositoryStub, 'create')

      await sut.reply(replyParams)

      expect(spy).toHaveBeenCalledWith({
        content: replyParams.content,
        post: expect.objectContaining(MOCK_POST),
        parentReply: null,
        user: expect.objectContaining(MOCK_USER)
      })
    })

    it('should create reply from reply on success', async () => {
      const { sut, replyRepositoryStub } = makeSut()

      const spy = jest.spyOn(replyRepositoryStub, 'create')

      await sut.reply({ ...replyParams, replyContentId: MOCK_REPLY.id })

      expect(spy).toHaveBeenCalledWith({
        content: replyParams.content,
        post: expect.objectContaining(MOCK_POST),
        parentReply: expect.objectContaining(MOCK_REPLY),
        user: expect.objectContaining(MOCK_USER)
      })
    })

    it('should throw NotFound if user not found', async () => {
      const { sut, userRepositoryStub } = makeSut()
      jest.spyOn(userRepositoryStub, 'findByUserId').mockResolvedValueOnce(null)

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow(new NotFound('User not found'))
    })

    it('should throw NotFound if post not found', async () => {
      const { sut, postRepositoryStub } = makeSut()
      jest.spyOn(postRepositoryStub, 'findById').mockResolvedValueOnce(null)

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow(new NotFound('Post not found'))
    })

    it('should throw if create reply throws', async () => {
      const { sut, replyRepositoryStub } = makeSut()
      jest
        .spyOn(replyRepositoryStub, 'create')
        .mockRejectedValueOnce(new Error())

      const res = sut.reply(replyParams)

      await expect(res).rejects.toThrow()
    })
  })

  it('should throw if does not find parent reply', () => {
    const { sut, replyRepositoryStub } = makeSut()
    jest.spyOn(replyRepositoryStub, 'findById').mockResolvedValueOnce(null)

    const res = sut.reply({
      authorId: MOCK_USER.id,
      content: MOCK_REPLY.content,
      postId: MOCK_POST.id,
      replyContentId: MOCK_REPLY.id
    })

    expect(res).rejects.toThrow(new NotFound('Reply not found'))
  })
})
