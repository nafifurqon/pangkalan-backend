/* eslint-disable camelcase */
/* eslint-disable no-undef */
const supertest = require('supertest');
const app = require('../../app');
const service = require('../../services');

const request = supertest(app);

const mock = require('../mock');

const seller = mock.user;
const { statuses, another_transaction } = mock;
const transaction = { ...mock.transaction, seller: null };

beforeAll(async () => {
  res = await request
    .post('/users/register')
    .send(seller);

  console.log('res.body seller', res.body);

  transaction.seller = res.body.data.user_profile_id;
  another_transaction.seller = res.body.data.user_profile_id;
});

afterAll(async () => {
  await service.history.removeAll();
  await service.transaction.removeAll();
  await service.userProfile.removeAll();
  await service.user.removeAll();
});

describe('Transaction.create', () => {
  it('should successfully create transaction', async () => {
    res = await request
      .post('/transactions')
      .send(transaction);

    console.log('res.body', res.body);

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

  it('should successfully create transaction and set status to pending when status is udndefined', async () => {
    const newTransaction = { ...transaction };
    delete newTransaction.status;

    res = await request
      .post('/transactions')
      .send(newTransaction);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully create transaction');
    expect(res.body).toHaveProperty('data');

    expect(res.body.data).toHaveProperty('do_number', transaction.do_number);
    expect(res.body.data).toHaveProperty('seller', seller.full_name);
    expect(res.body.data).toHaveProperty('quantity', transaction.quantity);
    expect(res.body.data).toHaveProperty('status', statuses[1].name);
  });

  it('should failed create transaction when do_number is null', async () => {
    const newTransaction = { ...transaction };
    newTransaction.do_number = null;

    res = await request
      .post('/transactions')
      .send(newTransaction);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'DO number cannot be empty');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should create history when successfully create transaction', async () => {
    res = await request
      .post('/transactions')
      .send(another_transaction);

    console.log('res.body', res.body);

    const transactionResult = res.body.data;

    const history = await service.history.find({ transaction_id: transactionResult.id });

    expect(history).toHaveProperty('transaction_id', transactionResult.id);
    expect(history).toHaveProperty('status', another_transaction.status);
  });
});
