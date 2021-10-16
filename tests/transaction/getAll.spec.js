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

describe('Transaction.getAll', () => {
  it('should successfully get all transaction by seller', async () => {
    res = await request
      .get('/transactions')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully get transaction');
    expect(res.body).toHaveProperty('data');

    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.body.data[0]).toHaveProperty('do_number');
    expect(res.body.data[0]).toHaveProperty('seller');
    expect(res.body.data[0]).toHaveProperty('quantity');
    expect(res.body.data[0]).toHaveProperty('customer');
    expect(res.body.data[0]).toHaveProperty('transaction_date');
    expect(res.body.data[0]).toHaveProperty('status');
  });

  it('should successfully get all transaction by month and seller', async () => {
    res = await request
      .get('/transactions')
      .query({ date: '10-2021' })
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully get transaction');
    expect(res.body).toHaveProperty('data');

    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.body.data[0]).toHaveProperty('do_number');
    expect(res.body.data[0]).toHaveProperty('seller');
    expect(res.body.data[0]).toHaveProperty('quantity');
    expect(res.body.data[0]).toHaveProperty('customer');
    expect(res.body.data[0]).toHaveProperty('transaction_date');
    expect(res.body.data[0]).toHaveProperty('status');
  });

  it('should successfully get all transaction by start_date/end_date and seller', async () => {
    res = await request
      .get('/transactions')
      .query({ start_date: '2021-10-01', end_date: '2021-10-30' })
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully get transaction');
    expect(res.body).toHaveProperty('data');

    expect(Array.isArray(res.body.data)).toBe(true);

    expect(res.body.data[0]).toHaveProperty('do_number');
    expect(res.body.data[0]).toHaveProperty('seller');
    expect(res.body.data[0]).toHaveProperty('quantity');
    expect(res.body.data[0]).toHaveProperty('customer');
    expect(res.body.data[0]).toHaveProperty('transaction_date');
    expect(res.body.data[0]).toHaveProperty('status');
  });

  it('should failed get all transaction by month when transaction is not found', async () => {
    res = await request
      .get('/transactions')
      .query({ date: '09-2021' })
      .set('Authorization', token);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Transaction is not found');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should failed get all transaction by start_date/end_date when transaction is not found', async () => {
    res = await request
      .get('/transactions')
      .query({ start_date: '2021-01-01', end_date: '2021-01-30' })
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
