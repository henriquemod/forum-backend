import { BadRequest, NotFound } from '@/application/errors'
import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db/user'

export class UserManager implements User.Get, User.Register {
  constructor(private readonly userRepository: DBUser.Find & DBUser.Add) {}
  async registerUser(
    user: Omit<UserModel, 'id'>
  ): Promise<User.RegisterResult> {
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
  ): Promise<UserModel> {
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
