import { NotFound } from '@/application/errors'
import type { User } from '@/data/usecases'
import type { User as UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db/user'

export class UserManagement implements User.GetUser {
  constructor(private readonly userRepository: DBUser.Find) {}

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
