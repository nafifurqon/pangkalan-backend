const response = require('../reponses/api');
const service = require('../services');
const help = require('../helpers/transaction');

const create = async (req, res) => {
  try {
    const {
      do_number, seller, customer, quantity, transaction_date,
    } = req.body;

    const pendingStatus = await service.status.find({ name: 'Pending' });
    const status = req.body.status || pendingStatus.id;

    const registeredSeller = await service.userProfile.getById(seller);

    if (!registeredSeller) {
      response.failed(res, 404, 'Seller not found', null);
      return;
    }

    const transaction = await service.transaction.create({
      do_number, seller, customer, quantity, transaction_date, status,
    });

    await service.history.create({ transaction_id: transaction.id, status });

    let result = await service.transaction.get({ id: transaction.id });
    if (!result) {
      response.failed(res, 404, 'Transaction is not found', null);
      return;
    }

    result = help.format(result);
    response.success(res, 201, 'Successfully create transaction', result);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await service.transaction.get({ id });
    if (!transaction) {
      response.failed(res, 404, 'Transaction is not found', null);
      return;
    }

    response.success(res, 200, 'Successfully get transaction', transaction);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      do_number, seller, customer, quantity, transaction_date,
    } = req.body;

    const pendingStatus = await service.status.find({ name: 'Pending' });
    const status = req.body.status || pendingStatus.id;

    let transaction = await service.transaction.get({ id });
    if (!transaction) {
      response.failed(res, 404, 'Transaction is not found', null);
      return;
    }

    const registeredSeller = await service.userProfile.getById(seller);

    if (!registeredSeller) {
      response.failed(res, 404, 'Seller not found', null);
      return;
    }

    if (seller !== transaction.seller) {
      response.failed(res, 400, 'Can not update seller', null);
      return;
    }

    transaction = await service.transaction.update({
      do_number, seller, customer, quantity, transaction_date, status,
    }, id);

    if (transaction) await service.history.create({ transaction_id: id, status });

    response.success(res, 200, 'Successfully updated transaction', transaction);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    let transaction = await service.transaction.get({ id });
    if (!transaction) {
      response.failed(res, 404, 'Transaction is not found', null);
      return;
    }

    if (transaction) await service.history.remove({ transaction_id: id });

    transaction = await service.transaction.remove({ id });

    response.success(res, 200, 'Successfully deleted transaction', transaction);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const getAll = async (req, res) => {
  try {
    const { id } = req.user;
    const { month } = req.query;

    const transactions = await service.transaction.getAll({
      seller: id,
      month,
    });

    if (!transactions || transactions.length === 0) {
      response.failed(res, 404, 'Transaction is not found', null);
      return;
    }

    response.success(res, 200, 'Successfully get transaction', transactions);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

module.exports = {
  create,
  get,
  update,
  remove,
  getAll,
};
