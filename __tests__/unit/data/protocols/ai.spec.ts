import { InternalServerError } from '@/application/errors'
import { AIManager } from '@/data/protocols'
import type { Prompt } from '@/domain/usecases/ai'
import { PromptStub } from '../helpers'

interface SutTypes {
  sut: AIManager
  promptStub: Prompt.JSONFromPrompt
}

const makeSut = (): SutTypes => {
  const promptStub = new PromptStub()
  const sut = new AIManager(promptStub)

  return {
    sut,
    promptStub
  }
}

describe('AIManager', () => {
  describe('validateContent', () => {
    it('should return true if prompt level is higher than or equal to prompt level', async () => {
      const { sut } = makeSut()

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

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce({ level: 1 })

      const res = await sut.validateContent('any_title', 'any_content')

      expect(res).toBe(false)
    })

    it('should throw if prompt response is not an object', async () => {
      const { sut, promptStub } = makeSut()

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce('invalid_response')

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response is null', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce(null)

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response does not contain level', async () => {
      const { sut, promptStub } = makeSut()

      jest.spyOn(promptStub, 'JSONFromPrompt').mockResolvedValueOnce({})

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })

    it('should throw if prompt response level is not a number', async () => {
      const { sut, promptStub } = makeSut()

      jest
        .spyOn(promptStub, 'JSONFromPrompt')
        .mockResolvedValueOnce({ level: '1' })

      const promise = sut.validateContent('any_title', 'any_content')

      await expect(promise).rejects.toThrow(InternalServerError)
    })
  })
})
