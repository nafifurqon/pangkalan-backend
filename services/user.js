const { User, sequelize } = require('../models');
// const response = require('../reponses/service');

const remove = async (payload) => {
  try {
    const user = await User.destroy({
      where: payload,
    });

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeAll = async () => {
  try {
    const user = await sequelize.query('delete from users');

    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  remove,
  removeAll,
};
