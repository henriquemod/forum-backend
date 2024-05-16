import { makeApp } from '@/main/config/app'
import { env } from '@/main/config/env'
import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import { isEmpty, omit } from 'ramda'
import request from 'supertest'

const user = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email()
}

describe('Controller - Post', () => {
  const apiRequest = request(makeApp())
  let accessToken: string

  beforeAll(async () => {
    await mongoose.connect(env.mongoUrl)
    await apiRequest.post('/api/register').send(user)
    const res = await apiRequest.post('/api/login').send(omit(['email'], user))

    accessToken = res.body.accessToken
  })

  afterAll(async () => {
    await mongoose.disconnect()
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
    expect(res.body.length).toBeGreaterThan(0)
  })
})