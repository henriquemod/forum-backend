import type { Hash } from '@/data/usecases/'

export class HashStub implements Hash.Compare, Hash.Generate {
  async generate(_value: string): Promise<string> {
    return await Promise.resolve('any_hash')
  }

  async compare(_value: string, _hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
