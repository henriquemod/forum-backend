import { InternalServerError } from '@/application/errors'
import { AIPromptReplyToPost } from '@/data/protocols'
import type { Prompt } from '@/domain/usecases/ai'

import { ReplyToPostPromptStub } from '../../helpers'

jest.mock('@/main/config/env')

interface SutTypes {
  sut: AIPromptReplyToPost
  promptStub: Prompt.JSONFromPrompt
}

const makeSut = (): SutTypes => {
  const promptStub = new ReplyToPostPromptStub()
  const sut = new AIPromptReplyToPost(promptStub)

  return {
    sut,
    promptStub
  }
}

describe('AIPromptReplyToPost', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('promptReply', () => {
    it('should return a reply string if the response is successful', async () => {
      const { sut } = makeSut()

      const res = await sut.promptReply('any_title', 'any_content')

      expect(res).toBe('This is a test reply')
    })

    it('should return an empty string if the feature is disabled', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'disabled'
      })

      const res = await sut.promptReply('any_title', 'any_content')

      expect(res).toBe('')
    })

    it('should contain title and content on prompt text', () => {
      const { sut, promptStub } = makeSut()

      const promptSpy = jest.spyOn(promptStub, 'JSONFromPrompt')

      sut.promptReply('any_title', 'any_content')

      expect(promptSpy).toHaveBeenCalledWith(
        expect.stringContaining("title: 'any_title'")
      )
      expect(promptSpy).toHaveBeenCalledWith(
        expect.stringContaining("content: 'any_content'")
      )
    })

    it('should throw if prompt response is not an object', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'success',
        data: null
      })

      const promise = sut.promptReply('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response is null', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'error',
        message: 'any_message'
      })

      const promise = sut.promptReply('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response does not contain reply', async () => {
      const { sut, promptStub } = makeSut()

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce(
          {} as unknown as Prompt.JSONPromptResponse<{ reply: string }>
        )

      const promise = sut.promptReply('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response reply is not a string', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'success',
        data: { reply: 123 }
      })

      const promise = sut.promptReply('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })
  })
})
