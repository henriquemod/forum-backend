import type { User } from '@/data/usecases'
import type { Hash } from '@/data/usecases/encryption'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'

type UserDBUsecases = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId &
  DBUser.Add &
  DBUser.UpdateUser

type EncryptionDataUsecases = Hash.Generate

export class UserMongoRepository implements UserDBUsecases {
  constructor(
    private readonly hash: EncryptionDataUsecases,
    private readonly session?: ClientSession
  ) {}

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
  }: User.RegisterParams): Promise<DBUser.AddResult> {
    const hashedPassword = await this.hash.generate(password)

    const accessToken = new UserSchema(
      {
        username,
        email,
        password: hashedPassword
      },
      {
        session: this.session
      }
    )

    const { id } = await accessToken.save({ session: this.session })

    return {
      id
    }
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
    return await UserSchema.findOne({
      _id: id
    })
  }
}
