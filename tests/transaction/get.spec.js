/* eslint-disable camelcase */
/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../app');
const service = require('../../services');

const request = supertest(app);

const mock = require('../mock');

const seller = mock.user;
const { loginUser } = mock;
const transaction = { ...mock.transaction, seller: null };

let token = null;
let transactionId = null;

beforeAll(async () => {
  const res = await request
    .post('/users/register')
    .send(seller);

  transaction.seller = res.body.data.user_profile_id;

  const user = await request
    .post('/users/login')
    .send(loginUser);

  token = user.body.data.token;

  const createdTransaction = await request
    .post('/transactions')
    .set('Authorization', token)
    .send(transaction);

  transactionId = createdTransaction.body.data.id;
});

afterAll(async () => {
  await service.history.removeAll();
  await service.transaction.removeAll();
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('Transaction.get', () => {
  it('should successfully get transaction', async () => {
    res = await request
      .get(`/transactions/${transactionId}`)
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully get transaction');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('do_number', transaction.do_number);
    expect(res.body.data).toHaveProperty('seller');
    expect(res.body.data).toHaveProperty('quantity', transaction.quantity);
    expect(res.body.data).toHaveProperty('customer', transaction.customer);
    expect(res.body.data).toHaveProperty('transaction_date');
    expect(res.body.data).toHaveProperty('status', transaction.status);
    expect(res.body.data).toHaveProperty('histories');

    const sellerId = res.body.data.seller;
    expect(typeof sellerId).toBe('number');

    const { histories, id } = res.body.data;
    expect(Array.isArray(histories)).toBe(true);
    expect(histories[histories.length - 1]).toHaveProperty('status', transaction.status);
    expect(histories[0]).toHaveProperty('transaction_id', id);
  });

  it('should failed get transaction when transaction is not found', async () => {
    res = await request
      .get('/transactions/8654565')
      .set('Authorization', token);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Transaction is not found');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should return unauthorized when token is not set in request header', async () => {
    res = await request
      .get(`/transactions/${transactionId}`);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauthorized when token is invalid', async () => {
    res = await request
      .get(`/transactions/${transactionId}`)
      .set('Authorization', 'invalid token');

    expect(res.statusCode).toBe(401);
  });
});
