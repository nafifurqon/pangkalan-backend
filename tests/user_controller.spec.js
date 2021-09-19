/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../app');
const service = require('../services/user');

const request = supertest(app);

describe('User.register', () => {
  afterAll(async () => {
    await service.remove({
      email: 'test@email.com',
    });
  });

  it('should be successfully create user', async () => {
    res = await request
      .post('/users/register')
      .send({
        email: 'test@email.com',
        password: 'pa$$wordTest',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully resgitered user');
  });

  it('should be failed create user if email already registered', async () => {
    res = await request
      .post('/users/register')
      .send({
        email: 'test@email.com',
        password: 'pa$$wordTest',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email already registered');
    expect(res.body).toHaveProperty('data', null);
  });
});
