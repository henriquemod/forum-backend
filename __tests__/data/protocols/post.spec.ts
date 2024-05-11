import { PostManager } from '@/data/protocols'
import { omit } from 'ramda'
import { MOCK_POST } from '../../application/helpers'
import { type DBPostStub, MOCK_USER, PostRepositoryStub } from '../helpers'

interface SutTypes {
  sut: PostManager
  postRepositoryStub: DBPostStub
}

const MOCK_BODY = {
  ...omit(['user'], MOCK_POST),
  userId: MOCK_USER.id
}

const makeSut = (): SutTypes => {
  const postRepositoryStub = new PostRepositoryStub()
  const sut = new PostManager(postRepositoryStub)

  return {
    sut,
    postRepositoryStub
  }
}

describe('PostManager', () => {
  describe('createPost', () => {
    it('should return id on success', () => {
      const { sut } = makeSut()

      const res = sut.createPost(MOCK_BODY)

      expect(res).resolves.toEqual({ id: 'any_id' })
    })

    it('should throw if createPost throws', () => {
      const { sut, postRepositoryStub } = makeSut()
      jest
        .spyOn(postRepositoryStub, 'create')
        .mockRejectedValueOnce(new Error())

      const res = sut.createPost(MOCK_BODY)

      expect(res).rejects.toThrow()
    })
  })
})
