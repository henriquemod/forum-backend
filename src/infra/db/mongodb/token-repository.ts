import { MongoHelper } from '@/infra/db/mongodb'
import type { AddTokenRepository } from '@/data/protocols/db/token'

export class TokenMongoRepository implements AddTokenRepository {
  async add(
    data: AddTokenRepository.Params
  ): Promise<AddTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('tokens')
    const result = await accountCollection.insertOne(data)
    return result.insertedId !== null
  }
}
