import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import mongoose from 'mongoose'
import request from 'supertest'
import { faker } from '@faker-js/faker'
import { isEmpty, omit } from 'ramda'

describe('Controller - Auth', () => {
  const apiRequest = request(makeApp())

  beforeAll(async () => {
    await mongoose.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  it('Should create account', async () => {
    const responseUpdated = await apiRequest.post('/api/register').send({
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    })

    expect(responseUpdated.status).toBe(200)
    expect(responseUpdated.body.id).toBeDefined()
  })

  it('Should login', async () => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      email: faker.internet.email()
    }
    await apiRequest.post('/api/register').send(user)

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
    await apiRequest.post('/api/register').send(user)

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
    await apiRequest.post('/api/register').send(user)

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
