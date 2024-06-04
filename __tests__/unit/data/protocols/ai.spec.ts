import { InternalServerError } from '@/application/errors'
import { AIValidateContent } from '@/data/protocols'
import type { Prompt } from '@/domain/usecases/ai'
import { env } from '@/main/config/env'

import { PromptStub } from '../helpers'

jest.mock('@/main/config/env')

interface SutTypes {
  sut: AIValidateContent
  promptStub: Prompt.JSONFromPrompt
}

const makeSut = (): SutTypes => {
  const promptStub = new PromptStub()
  const sut = new AIValidateContent(promptStub)

  return {
    sut,
    promptStub
  }
}

describe('AIManager', () => {
  beforeEach(() => {
    env.features.aiAcceptanceLevel = 7
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('validateContent', () => {
    it('should return true if prompt level is higher than or equal to prompt level', async () => {
      const { sut } = makeSut()

      const res = await sut.validateContent('any_title', 'any_content')

      expect(res).toBe(true)
    })
    it('should return true if feature is disabled', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'disabled'
      })

      const res = await sut.validateContent('any_title', 'any_content')

      expect(res).toBe(true)
    })

    it('should contain title and content on prompt text', () => {
      const { sut, promptStub } = makeSut()

      const promptSpy = jest.spyOn(promptStub, 'JSONFromPrompt')

      sut.validateContent('any_title', 'any_content')

      expect(promptSpy).toHaveBeenCalledWith(
        expect.stringContaining("title: 'any_title'")
      )
      expect(promptSpy).toHaveBeenCalledWith(
        expect.stringContaining("content: 'any_content'")
      )
    })

    it('should return false if prompt level is lower than prompt level', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'success',
        data: { level: 1 }
      })

      const res = await sut.validateContent('any_title', 'any_content')

      expect(res).toBe(false)
    })

    it('should throw if prompt response is not an object', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'success',
        data: null
      })

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response is null', async () => {
      const { sut, promptStub } = makeSut()

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce({ type: 'error', message: 'any_message' })

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response does not contain level', async () => {
      const { sut, promptStub } = makeSut()

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce(
          {} as unknown as Prompt.JSONPromptResponse<{ level: number }>
        )

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response level is not a number', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({
        type: 'success',
        data: { level: '1' }
      })

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })
  })
})
