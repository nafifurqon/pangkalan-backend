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

const userRegister = {
  email: 'test@email.com',
  password: 'pa$$wordTest8',
  full_name: 'Pangkalan Test Tambun Selatan',
  address: 'Tambun Selatan',
  role_id: roles[1].id,
};

const userLogin = {
  email: 'test@email.com',
  password: 'pa$$wordTest8',
};

beforeAll(async () => {
  res = await request
    .post('/users/register')
    .send(userRegister);
});

afterAll(async () => {
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('User.login', () => {
  it('should be successfully login user', async () => {
    res = await request
      .post('/users/login')
      .send(userLogin);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully login user');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('email', userRegister.email);
    expect(res.body.data).toHaveProperty('full_name', userRegister.full_name);
    expect(res.body.data).toHaveProperty('address', userRegister.address);
    expect(res.body.data).toHaveProperty('role', roles[1].name);

    expect(res.body.data).toHaveProperty('token');
    expect(typeof res.body.data.token).toBe('string');
  });

  it('should be failed login user when email is not registered yet', async () => {
    const user = { ...userLogin };
    user.email = 'notregistered@email.com';

    res = await request
      .post('/users/login')
      .send(user);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'User not registered');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed login user when password is wrong', async () => {
    const user = { ...userLogin };
    user.password = 'CGKgkjvjkh^%76576';

    res = await request
      .post('/users/login')
      .send(user);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Wrong password');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed login user when email is invalid', async () => {
    const user = { ...userLogin };
    user.email = 'invalid email';

    res = await request
      .post('/users/login')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email must be valid');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed login user when email is an empty string', async () => {
    const user = { ...userLogin };
    user.email = '';

    res = await request
      .post('/users/login')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email cannot be empty');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed login user when email and password undefined', async () => {
    const user = { ...userLogin };
    delete user.email;
    delete user.password;

    res = await request
      .post('/users/login')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Email cannot be empty');
    expect(res.body).toHaveProperty('data', null);
  });
});
