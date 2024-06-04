import { faker } from '@faker-js/faker'

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

describe('Controller - Auth', () => {
  const apiRequest: TestAgent = request(makeApp({}))
  let db: typeof mongoose

  beforeAll(async () => {
    db = await mongoose.connect(env.mongoUrl)
  })

  beforeEach(() => {
    db.connection.dropDatabase()
  })

  afterAll(async () => {
    await db.connection.dropDatabase()
    await mongoose.disconnect()
    jest.clearAllMocks()
  })

  it('Should create account', async () => {
    const params = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    const responseUpdated = await apiRequest.post('/api/user').send(params)

    expect(responseUpdated.status).toBe(200)
    expect(responseUpdated.body.email).toBe(params.email)
    expect(responseUpdated.body.username).toBe(params.username)
    expect(responseUpdated.body.password).not.toBe(params.password)
  })

  it('Should login', async () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    await apiRequest.post('/api/user').send(user)

    const loginRequest = await apiRequest
      .post('/api/login')
      .send(omit(['email'], user))

    expect(loginRequest.status).toBe(200)
    expect(loginRequest.body.userId).toBeDefined()
    expect(loginRequest.body.accessToken).toBeDefined()
    expect(loginRequest.body.refreshAccessToken).toBeDefined()
  })

  it('Should logout', async () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    await apiRequest.post('/api/user').send(user)

    const loginRequest = await apiRequest
      .post('/api/login')
      .send(omit(['email'], user))

    const logoutRequest = await apiRequest
      .post('/api/logout')
      .set('Authorization', `Bearer ${loginRequest.body.accessToken}`)
      .send({
        accessToken: loginRequest.body.accessToken
      })

    expect(logoutRequest.status).toBe(204)
    expect(isEmpty(logoutRequest.body)).toBeTruthy()
  })

  it('Should refresh access token', async () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    await apiRequest.post('/api/user').send(user)

    const loginRequest = await apiRequest
      .post('/api/login')
      .send(omit(['email'], user))

    const refreshRequest = await apiRequest
      .post('/api/token')
      .set('Authorization', `Bearer ${loginRequest.body.accessToken}`)
      .send({
        accessToken: loginRequest.body.refreshAccessToken
      })

    expect(refreshRequest.status).toBe(200)
    expect(refreshRequest.body.accessToken).toBeDefined()
    expect(refreshRequest.body.accessRefreshToken).toBeDefined()
  })
})
