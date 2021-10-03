const { History } = require('../models');

const create = async (payload) => {
  try {
    const history = await History.create(payload);

    return Promise.resolve(history);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeAll = async () => {
  try {
    const history = await History.sync({ force: true });

    return Promise.resolve(history);
  } catch (error) {
    return Promise.reject(error);
  }
};

const find = async (payload) => {
  try {
    const history = await History.findOne({ where: payload });

    return Promise.resolve(history);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { create, removeAll, find };
