const { User } = require('../models');
const response = require('../reponses/api');
const help = require('../helpers/user');
const service = require('../services');

const register = async (req, res) => {
  try {
    const {
      email, password, role_id,
    } = req.body;

    // eslint-disable-next-line camelcase
    const full_name = req.body.full_name || '';
    const address = req.body.address || '';

    const role = await service.role.get({ id: role_id });
    if (!role.status) {
      response.failed(res, 404, role.message, null);
      return;
    }

    const user = await User.register({ email, password });

    const userProfile = await service.userProfile.create({
      full_name,
      address,
      role_id,
      user_id: user.id,
    });

    if (userProfile.status) {
      const result = await service.userProfile.getById(userProfile.data.id);
      if (!result.status) {
        response.failed(res, 404, result.message, null);
        return;
      }

      result.data = help.formatUser(result.data);
      response.success(res, 201, 'Successfully resgitered user', result.data);
      return;
    }

    response.failed(res, 500, 'Failed create user', null);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const login = async (req, res) => {
  try {
    const {
      email, password,
    } = req.body;

    let user = null;

    try {
      user = await User.authenticate({ email, password });
    } catch (error) {
      response.failed(res, 404, error.message, null);
      return;
    }

    const userProfile = await service.userProfile.get({ user_id: user.id });
    if (!userProfile.status) {
      response.failed(res, 404, userProfile.message, null);
      return;
    }

    const data = help.formatUser(userProfile.data);
    const token = help.generateToken(data);
    const result = {
      ...data,
      token,
    };

    response.success(res, 200, 'Successfully login user', result);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const isUserExists = help.isUserExists(id);

    if (isUserExists) {
      const result = await service.user.remove({ id });

      if (result.status) {
        response.success(res, 200, 'Successfully removed user', result.data);
        return;
      }
    }

    response.failed(res, 404, 'User not found', null);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

module.exports = {
  register,
  login,
  destroy,
};
