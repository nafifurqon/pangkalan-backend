const { Role } = require('../models');

const get = async (payload) => {
  try {
    const role = await Role.findOne({
      where: payload,
    });

    return Promise.resolve(role);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  get,
};
