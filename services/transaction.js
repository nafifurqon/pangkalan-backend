/* eslint-disable camelcase */
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
    const {
      seller, date, start_date, end_date, do_number, customer,
    } = payload;

    let transactions = [];

    if (date
      || (start_date && end_date)
      || do_number
      || customer) {
      const dateArray = date && date.split('-');
      const year = dateArray ? dateArray[0] : null;
      const month = dateArray ? dateArray[1] : null;

      const transactionsByMonth = await sequelize.query(
        `
        select * from transactions 
        where seller = ${seller} and (
        extract(month from "transaction_date") = ${month}
        and extract(year from "transaction_date") = ${year}
        or transaction_date between ${start_date ? `'${start_date}'` : null} 
        and ${end_date ? `'${end_date}'` : null}
        or do_number like ${do_number ? `'%${do_number}%'` : '\'\''}
        or customer like ${customer ? `'%${customer}%'` : '\'\''}
        )
        `,
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
