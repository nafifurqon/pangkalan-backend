const { History } = require('../models');
const response = require('../reponses/service');

const create = async (payload) => {
  try {
    const history = await History.create(payload);

    return response.success(history, 'Successfully create history');
  } catch (error) {
    return response.failed(null, error.message);
  }
};

const removeAll = async () => {
  try {
    const history = await History.sync({ force: true });

    return response.success(history, 'Successfully remove all history');
  } catch (error) {
    return response.failed(null, error.message);
  }
};

module.exports = { create, removeAll };
