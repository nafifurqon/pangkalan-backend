/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../app');
const service = require('../../services');

const request = supertest(app);

const roles = [
  { id: 1, name: 'Agen' },
  { id: 2, name: 'Pangkalan' },
  { id: 3, name: 'UMKM' },
  { id: 4, name: 'Admin' },
];

const userPayload = {
  email: 'test@email.com',
  password: 'pa$$wordTest8',
  full_name: 'Pangkalan Test Tambun Selatan',
  address: 'Tambun Selatan',
  role_id: roles[1].id,
};

beforeAll(async () => {
  res = await request
    .post('/users/register')
    .send(userPayload);
});

afterAll(async () => {
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('User.register', () => {
  it('should be successfully login user', async () => {
    res = await request
      .post('/users/login')
      .send(userPayload);

    console.log('res.body', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully login user');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('email', userPayload.email);
    expect(res.body.data).toHaveProperty('full_name', userPayload.full_name);
    expect(res.body.data).toHaveProperty('address', userPayload.address);
    expect(res.body.data).toHaveProperty('role', roles[1].name);

    expect(res.body.data).toHaveProperty('token');
    expect(typeof res.body.data.token).toBe('string');
  });
});
