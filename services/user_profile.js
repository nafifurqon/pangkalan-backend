const { UserProfile } = require('../models');
const response = require('../reponses/service');

const create = async (payload) => {
  try {
    const userProfile = await UserProfile.create(payload);

    return response.success(userProfile, 'Successfully create user profile');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

const getById = async (id) => {
  try {
    const userProfile = await UserProfile.findOne({
      include: ['user', 'role'],
      where: { id },
    });

    return response.success(userProfile, 'Successfully get user profile by id');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

const get = async (payload) => {
  try {
    const userProfile = await UserProfile.findOne({
      where: payload,
    });

    return response.success(userProfile, 'Successfully get user profile');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

const remove = async (payload) => {
  try {
    const user = await UserProfile.destroy({
      where: payload,
    });

    return response.success(user, 'Successfully remove user');
  } catch (error) {
    return response.failed(null, error.mesage);
  }
};

module.exports = {
  create,
  getById,
  get,
  remove,
};
