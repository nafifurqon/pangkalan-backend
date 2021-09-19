const { User } = require('../models');
const response = require('../reponses/service');

const remove = async (payload) => {
  try {
    const user = await User.destroy({
      where: payload,
    });

    return response.success(user, 'Successfully remove user');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

module.exports = {
  remove,
};
