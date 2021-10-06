const { Transaction, sequelize } = require('../models');
// const response = require('../reponses/service');

const create = async (payload) => {
  try {
    const transaction = await Transaction.create(payload);

    return Promise.resolve(transaction);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeAll = async () => {
  try {
    const transaction = await sequelize.query('delete from transactions');

    return Promise.resolve(transaction);
  } catch (error) {
    return Promise.reject(error);
  }
};

const get = async (payload) => {
  try {
    const transaction = await Transaction.findOne({
      include: ['transaction_status', 'seller_user', 'histories'],
      where: payload,
    });

    return Promise.resolve(transaction);
  } catch (error) {
    return Promise.reject(error);
  }
};

const update = async (payload, id) => {
  try {
    const result = await Transaction.update(payload, {
      where: { id },
    });

    const transaction = result[0];

    return Promise.resolve(transaction);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  create, removeAll, get, update,
};
