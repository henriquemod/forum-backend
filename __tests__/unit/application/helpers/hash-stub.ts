import type { Hash } from '@/data/usecases/'

export class HashStub implements Hash.Compare, Hash.Generate {
  async generate(value: string): Promise<string> {
    return await Promise.resolve('any_hash')
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
