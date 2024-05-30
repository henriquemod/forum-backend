import { BadRequest, NotFound } from '@/application/errors'
import type { User } from '@/data/usecases'
import { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.Add &
  DBUser.FindUserByUserId &
  DBUser.UpdateUser &
  DBUser.Delete

type UserDataUsecases = User.Get &
  User.Register &
  User.ActivateUser &
  User.GetPublic &
  User.DeleteUser

export class UserManager implements UserDataUsecases {
  constructor(private readonly userRepository: UserDBUsecases) {}

  async delete(authenticatedUserId: string, userId: string): Promise<void> {
    const requestUser =
      await this.userRepository.findByUserId(authenticatedUserId)
    const user = await this.userRepository.findByUserId(userId)

    const areSameUser = requestUser?.id === user?.id
    const isRequestUserAdmin = requestUser?.level === UserModel.Level.ADMIN
    const isRequestUserMaster = requestUser?.level === UserModel.Level.MASTER
    const isUserAdmin = user?.level === UserModel.Level.ADMIN

    if (isRequestUserMaster && areSameUser) {
      throw new BadRequest('You cannot delete yourself')
    }

    if (isRequestUserMaster) {
      await this.userRepository.delete(userId)
      return
    }

    if (isRequestUserAdmin && isUserAdmin && !areSameUser) {
      throw new BadRequest('You cannot delete an admin user')
    }

    if (authenticatedUserId === userId) {
      await this.userRepository.delete(userId)
      return
    }

    throw new BadRequest('You are not authorized to delete this user')
  }

  async functionToGetEntity(origin: User.Origin) {
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
    return functionToGetEntity
  }

  async getPublicUser(
    value: string,
    origin: User.Origin = 'username'
  ): Promise<User.PublicUserData> {
    const fn = await this.functionToGetEntity(origin)
    const user = await fn(value)
    if (!user) {
      throw new NotFound('User not found')
    }
    const publicUserData: User.PublicUserData = {
      username: user.username,
      createdAt: user.createdAt
    }

    return publicUserData
  }

  async activate(userId: string): Promise<void> {
    await this.userRepository.update({
      userId,
      userData: { verifiedEmail: true }
    })
  }

  async registerUser(user: User.RegisterParams): Promise<UserModel.SafeModel> {
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
    const fn = await this.functionToGetEntity(origin)
    const user = await fn(value)

    if (!user) {
      throw new NotFound('User not found')
    }

    return user
  }
}
