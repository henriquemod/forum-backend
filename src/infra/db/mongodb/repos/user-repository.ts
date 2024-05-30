import type { User } from '@/data/usecases'
import type { Hash } from '@/data/usecases/encryption'
import { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { pick } from 'ramda'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId &
  DBUser.Add &
  DBUser.UpdateUser &
  DBUser.Delete

type EncryptionDataUsecases = Hash.Generate

export class UserMongoRepository implements UserDBUsecases {
  constructor(
    private readonly hash: EncryptionDataUsecases,
    private readonly session?: ClientSession
  ) {}

  async delete(id: string): Promise<void> {
    await UserSchema.deleteOne({ _id: id }, { session: this.session })
  }

  async update({ userId, userData }: DBUser.UpdateUserParams): Promise<void> {
    await UserSchema.updateOne(
      {
        _id: userId
      },
      {
        $set: { ...userData, updatedAt: new Date() }
      },
      { session: this.session }
    )
  }

  async add({
    username,
    email,
    password
  }: User.RegisterParams): Promise<UserModel.SafeModel> {
    const hashedPassword = await this.hash.generate(password)

    const user = new UserSchema(
      {
        _id: new mongoose.Types.ObjectId(),
        username,
        email,
        password: hashedPassword,
        level: UserModel.Level.USER,
        verifiedEmail: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        session: this.session
      }
    )

    await user.save({ session: this.session })

    const userDTO = {
      ...pick(
        [
          'email',
          'createdAt',
          'updatedAt',
          'level',
          'username',
          'verifiedEmail'
        ],
        user
      ),
      id: user._id.toString()
    }

    return userDTO
  }

  async findByEmail(email: string): Promise<UserModel.Model | null> {
    return await UserSchema.findOne({
      email
    })
  }

  async findByUsername(username: string): Promise<UserModel.Model | null> {
    return await UserSchema.findOne({
      username
    })
  }

  async findByUserId(id: string): Promise<UserModel.Model | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null
    }
    const user = await UserSchema.findOne({
      _id: id
    })

    return user
  }
}
