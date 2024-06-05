/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { ApiError } from '@/application/protocols'
import { Controller } from '@/application/protocols/controller'
import type { HttpResponse } from '@/application/protocols/http/responses'

class TestController extends Controller {
  async perform(_httpRequest: unknown): Promise<HttpResponse> {
    return {} as HttpResponse
  }
}

interface SutTypes {
  sut: TestController
}

const makeSut = (): SutTypes => {
  const sut = new TestController()

  return {
    sut
  }
}

describe('Controller', () => {
  describe('handle', () => {
    it('should return the result of perform method if validation passes', async () => {
      const { sut } = makeSut()
      const httpRequest = {}
      const expectedResult = {} as HttpResponse

      sut.perform = jest.fn().mockResolvedValue(expectedResult)

      const response = await sut.handle(httpRequest)

      expect(response).toEqual(expectedResult)
    })

    it('should return the result of ApiError.errorHandler if an error occurs during perform method', async () => {
      const { sut } = makeSut()
      const httpRequest = {}
      const expectedError = new Error('Some error')

      sut.perform = jest.fn().mockRejectedValue(expectedError)

      const response = await sut.handle(httpRequest)

      expect(response).toEqual(ApiError.errorHandler(expectedError))
    })
  })
})
