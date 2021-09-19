const { User } = require('../models');
const response = require('../reponses/api');
const help = require('../helpers/user');
const service = require('../services/user');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.register({ email, password });

    response.success(res, 201, 'Successfully resgitered user', user);
  } catch (error) {
    response.failed(res, 500, error.message, null);
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const isUserExists = help.isUserExists(id);

    if (isUserExists) {
      const result = await service.remove({ id });

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
