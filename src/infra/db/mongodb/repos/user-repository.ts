import type {
  AddUserRepository,
  AuthenticateRepository,
  FindUserByEmailRepository
} from '@/data/protocols/db/user'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class UserMongoRepository
  implements
    AddUserRepository,
    FindUserByEmailRepository,
    AuthenticateRepository
{
  async add(data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    const accessToken = new UserSchema({
      username: data.username,
      email: data.email,
      password: data.password
    })
    const newUser = await accessToken.save()

    return {
      id: newUser.id
    }
  }

  async findByEmail(
    data: FindUserByEmailRepository.Params
  ): Promise<FindUserByEmailRepository.Result> {
    const user = await UserSchema.findOne({
      email: data.email
    })

    if (!user || !user.email || !user.username || !user.password) {
      throw new Error('User not found')
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password
    }
  }

  async authenticate(
    data: AuthenticateRepository.Params
  ): Promise<AuthenticateRepository.Result> {
    const user = await UserSchema.findOne({
      username: data.username
    })

    if (!user || !user.email || !user.username || !user.password) {
      throw new Error('Unauthorized')
    }

    // Access token is short-lived
    const token = jwt.sign(
      { id: user.id, username: data.username },
      env.jwtSecret,
      { expiresIn: '2d' }
    )

    // Refresh token is long-lived
    const refreshToken = jwt.sign(
      { id: user.id, username: data.username },
      env.refreshTokenSecret,
      { expiresIn: '7d' }
    )

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
      token,
      refreshToken
    }
  }
}
