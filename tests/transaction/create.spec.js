/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../app');
const service = require('../../services');

const request = supertest(app);

const mock = require('../mock');

const seller = mock.user;
const { statuses } = mock;
const transaction = { ...mock.transaction, seller: null };

beforeAll(async () => {
  res = await request
    .post('/users/register')
    .send(seller);

  transaction.seller = res.body.data.user_profile_id;
});

afterAll(async () => {
  await service.userProfile.removeAll();
  await service.user.removeAll();
  await service.transaction.removeAll();
  await service.history.removeAll();
});

describe('Transaction.create', () => {
  it('should successfully create transaction', async () => {
    res = await request
      .post('/transactions')
      .send(transaction);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully create transaction');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('do_number', transaction.do_number);
    expect(res.body.data).toHaveProperty('seller', seller.full_name);
    expect(res.body.data).toHaveProperty('quantity', transaction.quantity);
    expect(res.body.data).toHaveProperty('status', statuses[1].name);
  });

  it('should failed create transaction when seller is not registered yet', async () => {
    const newTransaction = { ...transaction };
    newTransaction.seller = 456;

    res = await request
      .post('/transactions')
      .send(newTransaction);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Seller not found');
    expect(res.body).toHaveProperty('data', null);
  });
});
