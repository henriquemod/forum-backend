import type { AddUserRepository } from '@/data/protocols/db/token'
import type { AuthenticateRepository } from '@/data/protocols/db/user'
import type { Authenticate } from '@/domain/features/auth'
import { UserSchema } from '@/infra/db/mongodb/schemas/user'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class UserMongoRepository
  implements AddUserRepository, AuthenticateRepository
{
  async add(data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    const accessToken = new UserSchema({
      username: data.username,
      email: data.email,
      password: data.password
    })
    const newUser = await accessToken.save()

    return {
      id: String(newUser._id)
    }
  }

  async auth(data: Authenticate.Params): Promise<Authenticate.Result> {
    const user = await UserSchema.findOne({
      username: data.username
    })

    if (!user) {
      throw new Error('Unauthorized')
    }

    // Access token is short-lived
    const token = jwt.sign(
      { id: user.id, username: data.username },
      env.jwtSecret,
      { expiresIn: '20s' }
    )

    // Refresh token is long-lived
    const refreshToken = jwt.sign(
      { id: user.id, username: data.username },
      env.refreshTokenSecret,
      { expiresIn: '7d' }
    )

    return {
      token,
      refreshToken
    }
  }
}
