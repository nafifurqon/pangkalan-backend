const { Status } = require('../models');

const find = async (payload) => {
  try {
    const status = await Status.findOne({ where: payload });

    return Promise.resolve(status);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { find };
