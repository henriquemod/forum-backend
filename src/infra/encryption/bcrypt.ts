import { InternalServerError } from '@/application/errors'
import type { Hash } from '@/data/usecases/encryption'
import { env } from '@/main/config/env'
import bcrypt from 'bcrypt'

export class BCryptHash implements Hash.Generate, Hash.Compare {
  async generate(value: string): Promise<string> {
    return await new Promise((resolve) => {
      bcrypt.hash(value, env.bcryptSalt, function (err, hash) {
        if (err) {
          throw new InternalServerError()
        }
        resolve(hash)
      })
    })
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await new Promise((resolve) => {
      bcrypt.compare(value, hash, function (err, result) {
        if (err) {
          throw new InternalServerError()
        }
        resolve(result)
      })
    })
  }
}
