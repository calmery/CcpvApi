import supertest from 'supertest'
import app from '../src/index'

const request = supertest(app)

describe('GET /', () => {
  it('should return 200', (done) => {
    request
      .get('/')
      .expect(200, done)
  })
})
