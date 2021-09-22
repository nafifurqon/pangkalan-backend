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
  email: 'test2@email.com',
  password: 'pa$$wordTest8',
  full_name: 'Pangkalan Test Tambun Selatan',
  address: 'Tambun Selatan',
  role_id: roles[1].id,
};

afterAll(async () => {
  const userProfile = await service.userProfile.get({
    full_name: userPayload.full_name,
    address: userPayload.address,
    role_id: userPayload.role_id,
  });

  if (userProfile.status) {
    await service.userProfile.remove({ id: userProfile.data.id });
    await service.user.remove({
      id: userProfile.data.user_id,
    });
  }
});

describe('User.register password validation', () => {
  it('should be failed create user when password is an empty string', async () => {
    const user = { ...userPayload };
    user.password = '';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must be more than 8');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when password length less than 8', async () => {
    const user = { ...userPayload };
    user.password = 'wdjbski';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must be more than 8');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when password has not uppercase', async () => {
    const user = { ...userPayload };
    user.password = 'pa$$wordtest8djfhlhsflhl';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must have uppercase');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when password has not lowercase', async () => {
    const user = { ...userPayload };
    user.password = 'PA$$WORDTEST8KCSBKJBCKSJC';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must have lowercase');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when password have spaces', async () => {
    const user = { ...userPayload };
    user.password = 'PA$$WOrdTE st8';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must not have spaces');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be failed create user when password not have symbol', async () => {
    const user = { ...userPayload };
    user.password = 'pa5SwordTest8';

    res = await request
      .post('/users/register')
      .send(user);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Password must have symbol');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should be successfully create user when password is valid', async () => {
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
});
