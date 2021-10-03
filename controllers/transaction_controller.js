const response = require('../reponses/api');
const service = require('../services');
const help = require('../helpers/transaction');

const create = async (req, res) => {
  try {
    const {
      do_number, seller, customer, quantity, status,
    } = req.body;

    const registeredSeller = await service.userProfile.getById(seller);

    if (!registeredSeller) {
      response.failed(res, 404, 'Seller not found', null);
      return;
    }

    const transaction = await service.transaction.create({
      do_number, seller, customer, quantity, status,
    });

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

module.exports = {
  create,
};
