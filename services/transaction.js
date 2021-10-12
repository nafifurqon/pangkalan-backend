const { Transaction, sequelize } = require('../models');

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

const remove = async (payload) => {
  try {
    const transaction = await Transaction.destroy({
      where: payload,
    });

    return Promise.resolve(transaction);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getAll = async (payload) => {
  try {
    const { seller, month } = payload;

    let transactions = [];

    if (month) {
      const transactionsByMonth = await sequelize.query(
        `select * from transactions 
        where extract(month from "createdAt") = ${month} 
        and seller = ${seller}`,
      );

      [transactions] = transactionsByMonth;
    } else {
      transactions = await Transaction.findAll({ where: { seller } });
    }

    return Promise.resolve(transactions);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  create,
  removeAll,
  get,
  update,
  remove,
  getAll,
};
