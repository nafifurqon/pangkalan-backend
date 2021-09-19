const { User } = require('../models');
const response = require('../reponses/api');
const help = require('../helpers/user');
const service = require('../services');

const register = async (req, res) => {
  try {
    const {
      email, password, full_name, address, role_id,
    } = req.body;

    const user = await User.register({ email, password });

    const userProfile = await service.userProfile.create({
      full_name,
      address,
      role_id,
      user_id: user.id,
    });

    if (userProfile.status) {
      const result = await service.userProfile.getById(userProfile.data.id);
      if (result.status) result.data = help.formatUser(result.data);

      response.success(res, 201, 'Successfully resgitered user', result.data);
      return;
    }

    response.failed(res, 500, 'Failed create user', null);
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
  destroy,
};
