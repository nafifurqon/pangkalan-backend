const { UserProfile, sequelize } = require('../models');
// const response = require('../reponses');

const create = async (payload) => {
  try {
    const userProfile = await UserProfile.create(payload);

    return Promise.resolve(userProfile);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getById = async (id) => {
  try {
    const userProfile = await UserProfile.findOne({
      include: ['user', 'role'],
      where: { id },
    });

    return Promise.resolve(userProfile);
  } catch (error) {
    return Promise.reject(error);
  }
};

const get = async (payload) => {
  try {
    const userProfile = await UserProfile.findOne({
      include: ['user', 'role'],
      where: payload,
    });

    return Promise.resolve(userProfile);
  } catch (error) {
    return Promise.reject(error);
  }
};

const remove = async (payload) => {
  try {
    const userProfile = await UserProfile.destroy({
      where: payload,
    });

    return Promise.resolve(userProfile);
  } catch (error) {
    return Promise.reject(error);
  }
};

const removeAll = async () => {
  try {
    const userProfile = await sequelize.query('delete from user_profiles');

    return Promise.resolve(userProfile);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  create,
  getById,
  get,
  remove,
  removeAll,
};
