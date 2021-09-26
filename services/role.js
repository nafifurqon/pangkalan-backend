const { Role } = require('../models');
const response = require('../reponses/service');

const get = async (payload) => {
  try {
    const userProfile = await Role.findOne({
      where: payload,
    });

    if (userProfile) {
      return response.success(userProfile, 'Successfully get role');
    }

    return response.failed(null, 'Role is not found');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

module.exports = {
  get,
};
