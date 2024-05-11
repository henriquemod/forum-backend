import { BadRequest, NotFound } from '@/application/errors'
import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.Add &
  DBUser.FindUserByUserId

type UserDataUsecases = User.Get & User.Register & User.FindUserByIdOrFail

export class UserManager implements UserDataUsecases {
  constructor(private readonly userRepository: UserDBUsecases) {}

  async findUserByIdOrFail(id: string): Promise<UserModel.Model> {
    const user = await this.userRepository.findByUserId(id)

    if (!user) {
      throw new NotFound('User not found')
    }

    return user
  }

  async registerUser(user: User.RegisterParams): Promise<User.RegisterResult> {
    const hasUsername = !!(await this.userRepository.findByUsername(
      user.username
    ))
    const hasEmail = !!(await this.userRepository.findByEmail(user.email))

    if (hasUsername || hasEmail) {
      throw new BadRequest('Username or email already in use')
    }

    const { id } = await this.userRepository.add(user)

    return { id }
  }

  async getUser(
    value: string,
    origin: User.Origin = 'username'
  ): Promise<UserModel.Model> {
    const functionToGetEntity =
      origin === 'username'
        ? this.userRepository.findByUsername
        : this.userRepository.findByEmail
    const user = await functionToGetEntity(value)

    if (!user) {
      throw new NotFound('User not found')
    }

    return user
  }
}
