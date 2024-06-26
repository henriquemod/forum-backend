import { faker } from '@faker-js/faker'

import { Redis } from 'ioredis'
import mongoose from 'mongoose'
import { isEmpty, omit } from 'ramda'
import request from 'supertest'
import type TestAgent from 'supertest/lib/agent'

import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'

jest.mock('@/main/config/env', () => {
  const MONGO_PORT = process.env.DB_PORT || '27017'
  const currentEnv = jest.requireActual('@/main/config/env')

  return {
    ...currentEnv,
    env: {
      ...currentEnv.env,
      mongoUrl: `mongodb://127.0.0.1:${MONGO_PORT}/e2eTesting?replicaSet=rs0`
    }
  }
})

const user = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email()
}

describe('Controller - Post', () => {
  let apiRequest: TestAgent
  let redis: Redis
  let accessToken: string
  let db: typeof mongoose

  beforeAll(async () => {
    redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null
    })
    apiRequest = request(
      makeApp({
        queueConnection: redis
      })
    )
    db = await mongoose.connect(env.mongoUrl)
  })

  beforeEach(async () => {
    await db.connection.dropDatabase()

    await apiRequest.post('/api/user').send(user)
    const res = await apiRequest.post('/api/login').send(omit(['email'], user))

    accessToken = res.body.accessToken
  })

  afterAll(async () => {
    await db.connection.dropDatabase()
    await mongoose.disconnect()
    await redis.quit()
    jest.clearAllMocks()
  })

  it('Should create post', async () => {
    const res = await apiRequest
      .post('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      })

    expect(res.status).toBe(200)
    expect(res.body.id).toBeDefined()
  })

  it('Should update post', async () => {
    const post = await apiRequest
      .post('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      })

    const res = await apiRequest
      .put('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        id: post.body.id,
        title: faker.lorem.sentence()
      })

    expect(res.status).toBe(204)
    expect(isEmpty(res.body)).toBeTruthy()
  })

  it('Should find post', async () => {
    const postContent = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    }
    const post = await apiRequest
      .post('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(postContent)

    const res = await apiRequest
      .get(`/api/post?id=${post.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe(postContent.title)
    expect(res.body.content).toBe(postContent.content)
  })

  it('Should delete post', async () => {
    const post = await apiRequest
      .post('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      })

    const res = await apiRequest
      .delete('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ id: post.body.id })

    expect(res.status).toBe(204)
    expect(isEmpty(res.body)).toBeTruthy()
  })

  it('Should list posts', async () => {
    const postContent = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph()
    }
    await apiRequest
      .post('/api/post')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(postContent)

    const res = await apiRequest
      .get('/api/posts')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
  })
})
