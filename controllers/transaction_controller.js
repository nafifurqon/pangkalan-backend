const response = require('../reponses/api');
const service = require('../services');
const help = require('../helpers/transaction');

const create = async (req, res) => {
  try {
    const {
      do_number, seller, customer, quantity,
    } = req.body;

    const pendingStatus = await service.status.find({ name: 'Pending' });
    const status = req.body.status || pendingStatus.id;

    const registeredSeller = await service.userProfile.getById(seller);

    if (!registeredSeller) {
      response.failed(res, 404, 'Seller not found', null);
      return;
    }

    const transaction = await service.transaction.create({
      do_number, seller, customer, quantity, status,
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

module.exports = {
  create,
  get,
};
