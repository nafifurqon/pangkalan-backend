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
  updated_transaction,
  another_user,
  update_another_transaction,
} = mock;
const transaction = { ...mock.transaction, seller: null };

let token = null;
let transactionId = null;
let anotherRegisteredUser = null;

beforeAll(async () => {
  const res = await request
    .post('/users/register')
    .send(seller);

  transaction.seller = res.body.data.user_profile_id;
  another_transaction.seller = res.body.data.user_profile_id;
  updated_transaction.seller = res.body.data.user_profile_id;
  update_another_transaction.seller = res.body.data.user_profile_id;

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
  it('should successfully update transaction', async () => {
    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', token)
      .send(updated_transaction);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully updated transaction');
    expect(res.body).toHaveProperty('data', 1);
  });

  it('should failed get transaction when transaction is not found', async () => {
    res = await request
      .put('/transactions/8654565')
      .set('Authorization', token)
      .send(updated_transaction);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Transaction is not found');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should return unauthorized when token is not set in request header', async () => {
    res = await request
      .put(`/transactions/${transactionId}`)
      .send(transaction);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauthorized when token is invalid', async () => {
    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', 'invalid token')
      .send(transaction);

    expect(res.statusCode).toBe(401);
  });

  it('should failed update transaction when seller is not registered yet', async () => {
    const newTransaction = { ...updated_transaction };
    newTransaction.seller = 456;

    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', token)
      .send(newTransaction);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Seller not found');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should failed update transaction when update seller', async () => {
    const newTransaction = { ...updated_transaction };
    newTransaction.seller = anotherRegisteredUser.body.data.user_profile_id;

    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', token)
      .send(newTransaction);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'Can not update seller');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should failed create transaction when do_number is null', async () => {
    const newTransaction = { ...updated_transaction };
    newTransaction.do_number = null;

    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', token)
      .send(newTransaction);

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('status', false);
    expect(res.body).toHaveProperty('message', 'DO number cannot be empty');
    expect(res.body).toHaveProperty('data', null);
  });

  it('should successfully updated transaction and set status to pending'
  + 'when status is udndefined', async () => {
    const newTransaction = { ...updated_transaction };
    delete newTransaction.status;

    res = await request
      .put(`/transactions/${transactionId}`)
      .set('Authorization', token)
      .send(newTransaction);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', true);
    expect(res.body).toHaveProperty('message', 'Successfully updated transaction');
    expect(res.body).toHaveProperty('data', 1);
  });

  it('should create new history to database when successfully update transaction', async () => {
    const createResult = await request
      .post('/transactions')
      .set('Authorization', token)
      .send(another_transaction);

    const newTransactionId = createResult.body.data.id;

    let getResult = await request
      .get(`/transactions/${newTransactionId}`)
      .set('Authorization', token);

    expect(getResult.body.data.histories.length).toBe(1);

    await request
      .put(`/transactions/${newTransactionId}`)
      .set('Authorization', token)
      .send(update_another_transaction);

    getResult = await request
      .get(`/transactions/${newTransactionId}`)
      .set('Authorization', token);

    expect(getResult.body.data.histories.length).toBe(2);
  });
});
