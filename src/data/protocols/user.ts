import { BadRequest, NotFound } from '@/application/errors'
import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.Add &
  DBUser.FindUserByUserId &
  DBUser.UpdateUser

type UserDataUsecases = User.Get & User.Register & User.ActivateUser

export class UserManager implements UserDataUsecases {
  constructor(private readonly userRepository: UserDBUsecases) {}

  async activate(userId: string): Promise<void> {
    await this.userRepository.update({
      userId,
      userData: { verifiedEmail: true }
    })
  }

  async registerUser(user: User.RegisterParams): Promise<UserModel.Model> {
    const hasUsername = !!(await this.userRepository.findByUsername(
      user.username
    ))
    const hasEmail = !!(await this.userRepository.findByEmail(user.email))

    if (hasUsername || hasEmail) {
      throw new BadRequest('Username or email already in use')
    }

    const createdUser = await this.userRepository.add(user)

    return createdUser
  }

  async getUser(
    value: string,
    origin: User.Origin = 'username'
  ): Promise<UserModel.Model> {
    let functionToGetEntity

    switch (origin) {
      case 'username':
        functionToGetEntity = this.userRepository.findByUsername
        break
      case 'email':
        functionToGetEntity = this.userRepository.findByEmail
        break
      case 'id':
        functionToGetEntity = this.userRepository.findByUserId
        break
    }

    const user = await functionToGetEntity(value)

    if (!user) {
      throw new NotFound('User not found')
    }

    return user
  }
}
