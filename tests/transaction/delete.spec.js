/* eslint-disable camelcase */
/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../app');
const service = require('../../services');

const request = supertest(app);

const mock = require('../mock');

const seller = mock.user;
const {
  another_transaction,
  loginUser,
  another_user,
} = mock;
const transaction = { ...mock.transaction, seller: null };

let token = null;
let transactionId = null;

beforeAll(async () => {
  const res = await request
    .post('/users/register')
    .send(seller);

  transaction.seller = res.body.data.user_profile_id;
  another_transaction.seller = res.body.data.user_profile_id;

  const user = await request
    .post('/users/login')
    .send(loginUser);

  token = user.body.data.token;

  const createdTransaction = await request
    .post('/transactions')
    .set('Authorization', token)
    .send(transaction);

  transactionId = createdTransaction.body.data.id;

  anotherRegisteredUser = await request
    .post('/users/register')
    .send(another_user);
});

afterAll(async () => {
  await service.history.removeAll();
  await service.transaction.removeAll();
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('Transaction.update', () => {
  it('should return unauthorized when token is not set in request header', async () => {
    res = await request
      .delete(`/transactions/${transactionId}`);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauthorized when token is invalid', async () => {
    res = await request
      .delete(`/transactions/${transactionId}`)
      .set('Authorization', 'invalid token');

    expect(res.statusCode).toBe(401);
  });

  it('should successfully delete transaction', async () => {
    res = await request
      .delete(`/transactions/${transactionId}`)
      .set('Authorization', token);

    console.log('res.body', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully deleted transaction');
    expect(res.body).toHaveProperty('data', 1);
  });

  it('should failed delete transaction when transaction not found', async () => {
    res = await request
      .delete(`/transactions/475673632`)
      .set('Authorization', token);

    console.log('res.body', res.body);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Transaction is not found');
    expect(res.body).toHaveProperty('data', null);
  });
});
