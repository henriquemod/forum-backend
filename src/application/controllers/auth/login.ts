import { Controller, ok, type HttpResponse } from '@/application/protocols'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { Login } from '@/domain/usecases/auth'
import type { SaveToken } from '@/domain/usecases/token'
import type { FindUserByUsernameRepository } from '@/data/protocols/db/user'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class LoginController extends Controller {
  constructor(
    private readonly userRepository: FindUserByUsernameRepository,
    private readonly tokenSaver: SaveToken
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Login.Params): Promise<HttpResponse<Login.Result>> {
    const user = await this.userRepository.findByUsername({
      username
    })

    if (user.password !== password) {
      // NOTE - Passwords should be hashed in a real-world application
      throw new Error('Invalid credentials')
    }

    // Access token is short-lived
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: '3h' }
    )

    // Refresh token is long-lived
    const refreshAccessToken = jwt.sign(
      { id: user.id, username: user.username },
      env.refreshTokenSecret,
      { expiresIn: '3d' }
    )

    await this.tokenSaver.save({
      email: user.email,
      accessToken,
      refreshAccessToken
    })

    return ok({
      email: user.email,
      accessToken,
      refreshAccessToken
    })
  }

  override buildValidators({ password, username }: Login.Params): Validator[] {
    return [
      ...builder
        .of({
          value: password,
          fieldName: 'password'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: username,
          fieldName: 'username'
        })
        .required()
        .build()
    ]
  }
}
