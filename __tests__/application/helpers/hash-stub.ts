import type { Hash } from '@/data/usecases/'

export class HashStub implements Hash.Compare {
  async compare(value: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
