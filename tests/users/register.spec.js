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

afterAll(async () => {
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('User.register', () => {
  it('should be successfully create user', async () => {
    res = await request
      .post('/users/register')
      .send(userPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully resgitered user');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('email', userPayload.email);
    expect(res.body.data).toHaveProperty('full_name', userPayload.full_name);
    expect(res.body.data).toHaveProperty('address', userPayload.address);
    expect(res.body.data).toHaveProperty('role', roles[1].name);
  });

  it('should be failed create user when email already registered', async () => {
    res = await request
      .post('/users/register')
      .send(userPayload);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email already registered');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when email is invalid', async () => {
    const userPayloadInvalidEmail = { ...userPayload };
    userPayloadInvalidEmail.email = 'test email';

    res = await request
      .post('/users/register')
      .send(userPayloadInvalidEmail);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email must be valid');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when email is an empty string', async () => {
    const userPayloadInvalidEmail = { ...userPayload };
    userPayloadInvalidEmail.email = '';

    res = await request
      .post('/users/register')
      .send(userPayloadInvalidEmail);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email cannot be empty');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should still successfully create user when full_name and address is empty', async () => {
    const user = { ...userPayload };
    user.email = 'test123456@email.com';
    user.password = 'pa$$wordTest8';
    user.full_name = '';
    user.address = '';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully resgitered user');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('email', user.email);
    expect(res.body.data).toHaveProperty('full_name', user.full_name);
    expect(res.body.data).toHaveProperty('address', user.address);
    expect(res.body.data).toHaveProperty('role', roles[1].name);
  });

  it('should still successfully create user when full_name and address is undefined', async () => {
    const user = { ...userPayload };
    user.email = 'test123coba@email.com';
    user.password = 'pa$$wordTest87654';
    delete user.full_name;
    delete user.address;

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully resgitered user');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('email', user.email);
    expect(res.body.data).toHaveProperty('full_name', '');
    expect(res.body.data).toHaveProperty('address', '');
    expect(res.body.data).toHaveProperty('role', roles[1].name);
  });
});
